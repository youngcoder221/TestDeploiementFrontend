export default function Avatar({ initiales, couleur = "from-blue-500 to-blue-300", size = "sm" }) {
  const sizes = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-9 h-9 text-[12px]",
    lg: "w-14 h-14 text-[20px]",
  };
  return (
    <div className={`bg-gradient-to-br ${couleur} ${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initiales}
    </div>
  );
}