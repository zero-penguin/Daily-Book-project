//Buttonコンポーネントを定義

type ButtonProps = {
    //childrenの型を定義
    children:React.ReactNode;
    //onClickの型を定義
    onClick?: () => void;
    //variantの型を定義
    variant?: "primary" | "secondary" | "danger";
    //typeの型を定義
    type?: "button" | "submit";
    //disabledの型を定義
    disabled?: boolean;
    
};

//Buttonコンポーネントを定義
export default function Button({
    //propsを受け取る
    children,
    onClick,
    variant = "primary",
    type = "button",
    disabled = false
    //propsの型を定義
}: ButtonProps) {
    //baseStyleを定義
    const baseStyle = "px-4 py-2 rounded font-medium transition-colors";

    //variantStyleを定義
    const variantStyle = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    };

    return(
        <button
            //ユーザーはbuttonのtypeを任意で定義
            type={type}
            //ユーザーはbuttonのonClickを任意で定義
            onClick={onClick}
            //ユーザーはbuttonのdisabledを任意で定義
            disabled={disabled}
            //ユーザーはbuttonのvariantを任意で定義
            className={`${baseStyle} ${variantStyle[variant]}`}
        >
            {children}
        </button>
    );

}