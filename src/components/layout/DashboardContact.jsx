import { useTranslation } from "react-i18next";

export default function DashboardContact({ showHomeLink = true }) {
  const { t } = useTranslation();
  const linkClass = "inline-flex min-h-11 min-w-0 max-w-full px-2 py-2 text-center [overflow-wrap:anywhere] items-center justify-center gap-2 rounded text-[13px] text-[#999ca1] transition-colors hover:text-[#d5af42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5af42]";

  return (
    <footer className="w-full min-w-0 border-t border-[#2b3036] pt-4">
      <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-6">
        <span className="text-[13px] font-medium text-[#f5f0e8]">{t("dashboard.contactUs")}</span>
        <address className="flex w-full min-w-0 flex-col items-center not-italic sm:w-auto sm:flex-row sm:flex-wrap sm:gap-x-6">
          <a href="mailto:contact@ivnexus.com" className={linkClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 6 9 7 9-7" strokeLinejoin="round" />
            </svg>
            <span className="min-w-0 [overflow-wrap:anywhere]" dir="ltr">contact@ivnexus.com</span>
          </a>
          <a href="https://wa.me/2250700228835" target="_blank" rel="noopener noreferrer" className={linkClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0">
              <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-4.8a8.5 8.5 0 1 1 15.9-4.2Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m8 7 1.5 3-1 1a8 8 0 0 0 4 4l1-1 3 1.5c-.5 1.5-1.5 2-3 1.5-3.5-1-6-3.5-7-7C6 8.5 6.5 7.5 8 7Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="min-w-0 [overflow-wrap:anywhere]" dir="ltr">+2250700228835</span>
          </a>
        </address>
      </div>
      {showHomeLink && (
      <a href="http://ivnexus.com/" className={`${linkClass} mt-3 w-full border-t border-[#2b3036] pt-3 text-[#d5af42] lg:hidden`}>
        {t("dashboard.backToHomepage")}
      </a>
      )}
    </footer>
  );
}
