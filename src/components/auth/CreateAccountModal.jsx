import logo from "../../assets/logo.png";

function CreateAccountModal({
  message,
  onClose,
  onEnglish,
  onFrench,
}) {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/75
        px-4 py-6
        sm:px-6
      "
    >
      <div
        className="
          relative
          w-full
          max-w-[585px]
          rounded-[16px]
          border border-[#34383d]
          bg-[#171d24]
          px-5
          pb-8
          pt-14
          shadow-[0_25px_70px_rgba(0,0,0,0.65)]
          sm:px-9
          sm:pb-12
          sm:pt-16
          md:px-11
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4 top-4
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-[#D6AF46]
            text-[#171d24]
            transition
            hover:bg-[#e4c15c]
            sm:right-7 sm:top-7
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            stroke="currentColor"
            strokeWidth="2.7"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-8 flex justify-center sm:mb-9">
          <img
            src={logo}
            alt="Ivory Nexus Solutions"
            className="
              h-auto
              w-[220px]
              object-contain
              sm:w-[285px]
            "
          />
        </div>

        {/* Content */}
        <div className="text-center">
          <h2
            className="
              mb-4
              text-[24px]
              font-semibold
              leading-tight
              text-[#F2F2F2]
              sm:text-[27px]
            "
          >
            Create Your Account
          </h2>

          {message && (
            <p role="alert" className="mx-auto mb-5 max-w-[470px] rounded-lg border border-[#D3AD48]/40 bg-[#D3AD48]/10 px-4 py-3 text-sm leading-6 text-[#D3AD48]">
              {message}
            </p>
          )}

          <p
            className="
              mx-auto
              max-w-[470px]
              text-[14px]
              leading-6
              text-[#A4A7AA]
              sm:text-[15px]
            "
          >
            To continue in English, please click the
            START IN ENGLISH button.
          </p>

          <p
            className="
              mx-auto
              mt-1
              max-w-[470px]
              text-[14px]
              leading-6
              text-[#A4A7AA]
              sm:text-[15px]
            "
          >
            Pour continuer en français, veuillez cliquer
            sur le bouton French Group.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-9 space-y-3 sm:mt-11">
          <button
            type="button"
            onClick={onEnglish}
            className="
              flex
              min-h-[52px]
              w-full
              items-center
              justify-center
              rounded-[8px]
              bg-[#D3AD48]
              px-5
              text-[14px]
              font-semibold
              uppercase
              tracking-[0.01em]
              text-[#11151A]
              transition
              hover:bg-[#e0ba54]
              active:scale-[0.99]
              sm:min-h-[54px]
              sm:text-[15px]
            "
          >
            START IN ENGLISH
          </button>

          <button
            type="button"
            onClick={onFrench}
            className="
              flex
              min-h-[52px]
              w-full
              items-center
              justify-center
              rounded-[8px]
              border border-[#D3AD48]
              bg-transparent
              px-5
              text-[14px]
              font-semibold
              uppercase
              tracking-[0.01em]
              text-[#D3AD48]
              transition
              hover:bg-[#D3AD48]/10
              active:scale-[0.99]
              sm:min-h-[54px]
              sm:text-[15px]
            "
          >
            DÉMARRER EN FRANÇAIS
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountModal;