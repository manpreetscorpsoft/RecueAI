function BulkDeleteConfirmModal({
  count = 0,
  deleting = false,
  onClose,
  onConfirm,
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/75
        px-4
      "
    >
      {/* =====================================================
          MODAL
      ====================================================== */}

      <div
        className="
          relative
          w-full
          max-w-[475px]
          rounded-[16px]
          border
          border-[#5b4d24]
          bg-[#171c22]
          p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.55)]

          sm:p-8
        "
      >
        {/* =====================================================
            CLOSE BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-full
            bg-[#d5af42]
            text-[#111418]
            transition

            hover:brightness-110

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:right-6
            sm:top-6
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <div className="pr-12">
          <h2
            className="
              text-[20px]
              font-semibold
              leading-tight
              text-[#f5f0e8]

              sm:text-[22px]
            "
          >
            Delete Expenses
          </h2>

          <p
            className="
              mt-2
              text-[13px]
              text-[#999ca1]

              sm:text-[14px]
            "
          >
            Confirm expense deletion
          </p>
        </div>

        {/* =====================================================
            INFORMATION BOX
        ====================================================== */}

        <div
          className="
            mt-7
            rounded-[12px]
            border
            border-[#5b4d24]
            bg-[#0c1016]
            p-4

            sm:p-5
          "
        >
          {/* Question */}

          <p
            className="
              text-[14px]
              font-medium
              leading-6
              text-[#f0ede7]

              sm:text-[15px]
            "
          >
            Are you sure you want to delete these expenses?
          </p>

          {/* Divider */}

          <div className="my-4 h-px w-full bg-[#34383d]" />

          {/* Selected count */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              className="
                text-[13px]
                text-[#999ca1]

                sm:text-[14px]
              "
            >
              Selected expenses
            </span>

            <span
              className="
                text-[14px]
                font-semibold
                text-[#d5af42]

                sm:text-[15px]
              "
            >
              {count}
            </span>
          </div>
        </div>

        {/* =====================================================
            WARNING
        ====================================================== */}

        <p
          className="
            mt-5
            text-[12px]
            leading-5
            text-[#999ca1]

            sm:text-[13px]
          "
        >
          This action cannot be undone.
        </p>

        {/* =====================================================
            BUTTONS
        ====================================================== */}

        <div
          className="
            mt-7
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2
          "
        >
          {/* Cancel */}

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              flex
              h-[48px]
              w-full
              items-center
              justify-center
              rounded-[9px]
              border
              border-[#5b4d24]
              bg-[#0c1016]
              px-5
              text-[13px]
              font-semibold
              uppercase
              text-[#b6b8bb]
              transition

              hover:bg-[#11161d]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* Confirm Delete */}

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="
              flex
              h-[48px]
              w-full
              items-center
              justify-center
              rounded-[9px]
              bg-[#d5af42]
              px-5
              text-[13px]
              font-semibold
              uppercase
              text-[#111418]
              transition

              hover:brightness-110

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {deleting ? "Deleting..." : "Delete Expenses"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkDeleteConfirmModal;
