import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

import { randomUUID } from "node:crypto";

import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { docClient } from "./dynamodb";

type ResourceConfig = {
  tableName: string;
  resourceName: "book" | "article";
  allowedFields: string[];
  validate: (data: Record<string, unknown>) => string | null;
};

// ============================================
// 共通レスポンス
// ============================================

const response = (statusCode: number, body?: unknown) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  body: body === undefined ? "" : JSON.stringify(body),
});

// ============================================
// 管理者チェック
// ============================================



type EventWithOptionalAuthorizer = APIGatewayProxyEventV2 & {
  requestContext: APIGatewayProxyEventV2["requestContext"] & {
    authorizer?: {
      jwt?: {
        claims?: Record<string, unknown>;
      };
    };
  };
};


const isAdmin = (event: APIGatewayProxyEventV2): boolean => {
  const extendedEvent = event as EventWithOptionalAuthorizer;

  const groups =
    extendedEvent.requestContext.authorizer?.jwt?.claims?.[
      "cognito:groups"
    ];

  if (Array.isArray(groups)) {
    return groups.includes("Admins");
  }

  if (typeof groups === "string") {
    const normalized = groups.trim();

    // JSON配列形式 ["Admins"] に対応
    try {
      const parsed = JSON.parse(normalized);

      if (Array.isArray(parsed)) {
        return parsed.includes("Admins");
      }
    } catch {
      // JSON形式でない場合は次の処理へ
    }

    // [Admins] や Admins の形式に対応
    const normalizedGroups = normalized
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((group) => group.trim().replace(/^["']|["']$/g, ""));

    return normalizedGroups.includes("Admins");
  }

  return false;
};




// ============================================
// リクエストボディ解析
// ============================================

const parseBody = (body: string | undefined) => {
  if (!body) {
    throw new Error("リクエストボディがありません");
  }

  return JSON.parse(body) as Record<string, unknown>;
};

// ============================================
// CRUDハンドラー
// ============================================

export const createCrudHandler = (
  config: ResourceConfig
): APIGatewayProxyHandlerV2 => {
  return async (event) => {
    try {
      const method = event.requestContext.http.method;
      const id = event.pathParameters?.id;

      // ========================================
      // 管理者チェック
      // 書き込み操作はAdminsグループのみ許可
      // ========================================

      if (
        ["POST", "PUT", "DELETE"].includes(method) &&
        !isAdmin(event)
      ) {
        return response(403, {
          message: "この操作は管理者のみ実行できます",
        });
      }

      // ========================================
      // 一覧取得
      // ========================================

      if (method === "GET" && !id) {
        const items: Record<string, unknown>[] = [];
        let lastKey: Record<string, unknown> | undefined;

        do {
          const result = await docClient.send(
            new ScanCommand({
              TableName: config.tableName,
              ExclusiveStartKey: lastKey,
            })
          );

          items.push(...(result.Items ?? []));
          lastKey = result.LastEvaluatedKey;
        } while (lastKey);

        return response(200, {
          [config.resourceName + "s"]: items,
        });
      }

      // ========================================
      // 1件取得
      // ========================================

      if (method === "GET" && id) {
        const result = await docClient.send(
          new GetCommand({
            TableName: config.tableName,
            Key: { id },
          })
        );

        if (!result.Item) {
          return response(404, {
            message: "データが見つかりません",
          });
        }

        return response(200, {
          [config.resourceName]: result.Item,
        });
      }

      // ========================================
      // 登録
      // ========================================

      if (method === "POST") {
        const data = parseBody(event.body);
        const validationError = config.validate(data);

        if (validationError) {
          return response(400, {
            message: validationError,
          });
        }

        // 許可された項目だけを登録する
        const values = Object.fromEntries(
          Object.entries(data).filter(([key]) =>
            config.allowedFields.includes(key)
          )
        );

        const now = new Date().toISOString();

        const item = {
          ...values,
          id: randomUUID(),
          createdAt: now,
          updatedAt: now,
        };

        await docClient.send(
          new PutCommand({
            TableName: config.tableName,
            Item: item,
            ConditionExpression: "attribute_not_exists(id)",
          })
        );

        return response(201, {
          [config.resourceName]: item,
        });
      }

      // ========================================
      // 更新
      // ========================================

      if (method === "PUT" && id) {
        const data = parseBody(event.body);
        const validationError = config.validate(data);

        if (validationError) {
          return response(400, {
            message: validationError,
          });
        }

        const values = Object.fromEntries(
          Object.entries(data).filter(([key]) =>
            config.allowedFields.includes(key)
          )
        );

        const entries = Object.entries(values);

        if (entries.length === 0) {
          return response(400, {
            message: "更新する項目がありません",
          });
        }

        const names: Record<string, string> = {};
        const attributeValues: Record<string, unknown> = {};

        const updateExpressions = entries.map(
          ([key, value], index) => {
            const name = `#field${index}`;
            const placeholder = `:value${index}`;

            names[name] = key;
            attributeValues[placeholder] = value;

            return `${name} = ${placeholder}`;
          }
        );

        names["#updatedAt"] = "updatedAt";
        attributeValues[":updatedAt"] = new Date().toISOString();

        updateExpressions.push("#updatedAt = :updatedAt");

        const result = await docClient.send(
          new UpdateCommand({
            TableName: config.tableName,
            Key: { id },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ConditionExpression: "attribute_exists(id)",
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: attributeValues,
            ReturnValues: "ALL_NEW",
          })
        );

        return response(200, {
          [config.resourceName]: result.Attributes,
        });
      }

      // ========================================
      // 削除
      // ========================================

      if (method === "DELETE" && id) {
        await docClient.send(
          new DeleteCommand({
            TableName: config.tableName,
            Key: { id },
            ConditionExpression: "attribute_exists(id)",
          })
        );

        return response(204);
      }

      return response(404, {
        message: "APIが見つかりません",
      });

    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
      ) {
        return response(404, {
          message: "データが見つかりません",
        });
      }

      if (error instanceof SyntaxError) {
        return response(400, {
          message: "JSON形式が不正です",
        });
      }

      console.error("API error:", error);

      return response(500, {
        message: "サーバー内部でエラーが発生しました",
      });
    }
  };
};
