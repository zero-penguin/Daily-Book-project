// TextAreaコンポーネントのPropsを定義

type TextAreaProps = {
    
    // 入力値の型を定義
    value: string;

    // onChangeの型を定義
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    // placeholderの型を定義
    placeholder?: string;

    // rowsの型を定義
    rows?: number;

    // disabledの型を定義
    disabled?: boolean;

    // requiredの型を定義
    required?: boolean;
};

// TextAreaコンポーネントを定義
export default function TextArea({
    // propsを受け取る
    value,
    onChange,
    placeholder,
    rows = 4,
    disabled = false,
    required = false
}: TextAreaProps) {

    // baseStyleを定義
    const baseStyle =
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

    return (
        <textarea
            // 入力値を設定
            value={value}
            // 入力時の処理を設定
            onChange={onChange}
            // placeholderを設定
            placeholder={placeholder}
            // 表示する行数を設定
            rows={rows}
            // disabledを設定
            disabled={disabled}
            // requiredを設定
            required={required}
            // スタイルを設定
            className={baseStyle}
        />
    );
}
