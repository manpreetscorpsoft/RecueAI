function StatCard({ title, value, icon, children }) {
  return (
    <div
      className="
        min-h-[138px]
        rounded-[14px]
        border
        border-[#403a28]
        bg-[#171c22]
        p-4

        sm:min-h-[150px]
        sm:p-5

        lg:min-h-[168px]
        lg:p-6
      "
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="
            text-[11px]
            font-medium
            uppercase
            text-[#92959a]

            sm:text-[12px]
          "
        >
          {title}
        </span>

        {icon && (
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-[7px]
              border
              border-[#49422d]
              bg-[#1c2127]
              text-[#d5af42]

              lg:h-9
              lg:w-9
            "
          >
            {icon}
          </div>
        )}
      </div>

      {/* Main value */}
      <div
        className="
          mt-4
          text-[20px]
          font-semibold
          leading-tight
          text-[#f5f0e8]

          sm:text-[22px]
          lg:text-[24px]
        "
      >
        {value}
      </div>

      {/* Extra information */}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default StatCard;
