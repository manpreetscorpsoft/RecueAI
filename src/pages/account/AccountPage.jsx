import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getUserFullDetails } from "../../services/userService";
import { applyUserLanguage } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
function AccountPage() {
  const { t } = useTranslation();
  const userId = 260;
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const layoutRole = accountData?.layoutRole || "admin";

  const loadAccountDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUserFullDetails(userId);

      console.log("Account page API response:", data);

      if (!data?.success || !data?.user) {
        throw new Error("User account details were not returned.");
      }

      applyUserLanguage(data.user.language);

      const user = data.user;
      const group = data.group || null;
      const isGroupAccount = data.account_type === "group";
      const groupRole = group?.current_user?.role || group?.role || null;
      const userType = isGroupAccount
        ? groupRole === "admin"
          ? "groupAdmin"
          : groupRole === "member"
            ? "groupMember"
            : "groupUser"
        : "personal";
      const resolvedLayoutRole =
        isGroupAccount && groupRole === "member" ? "member" : "admin";

      const userDetails = {
        userId: user.user_id,
        phone: cleanText(user.phone),
        language: cleanText(user.language),
        currency:
          cleanText(user.currency) || cleanText(user.default_currency) || "-",
        accountStatus: cleanText(user.status) || "-",
        userType,
        layoutRole: resolvedLayoutRole,
        currentPlan: cleanText(user.plan_name) || "-",
        planId: user.plan_id,
        subscriptionStatus: cleanText(user.subscription_status) || "-",
        expenseLimit: user.total_expense_limit ?? 0,
        expensesUsed: user.used_limit ?? 0,
        remainingExpenses: user.remaining_limit ?? 0,
        planStarted: formatAccountDate(user.plan_started_at),
        planExpires: formatAccountDate(user.plan_expires_at),
        accountType: data.account_type,
        group,
        groupId: group?.group_id || null,
        groupName: cleanText(group?.group_name),
        groupStatus: cleanText(group?.group_status),
        groupRole: cleanText(groupRole),
        groupMonthlyLimit: group?.monthly_limit ?? null,
        groupUsedLimit: group?.used_limit ?? null,
        groupRemainingLimit: group?.remaining_limit ?? null,
        groupMembers: Array.isArray(group?.members) ? group.members : [],
        groupMemberCount: Array.isArray(group?.members)
          ? group.members.length
          : 0,
      };

      setAccountData(userDetails);
    } catch (err) {
      console.error("Unable to load account details:", err);
      setError("Unable to load account information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountDetails();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role={layoutRole} phone="">
        <div className="text-[14px] text-[#999ca1]">{t("account.loading")}</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role={layoutRole} phone="">
        <div className="text-[14px] text-red-400">{t("account.loadError")}</div>
      </DashboardLayout>
    );
  }

  if (!accountData) {
    return (
      <DashboardLayout role={layoutRole} phone="">
        <div className="text-[14px] text-[#999ca1]">{t("account.empty")}</div>
      </DashboardLayout>
    );
  }

  const UserIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="3" />
      <path
        d="M6 20v-2.5A5.5 5.5 0 0 1 11.5 12h1A5.5 5.5 0 0 1 18 17.5V20"
        strokeLinecap="round"
      />
    </svg>
  );

  const CrownIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 7l4 4 4-6 4 6 4-4-2 10H6L4 7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <DashboardLayout role={layoutRole} phone={accountData.phone}>
      {/* =========================
          PAGE HEADING
      ========================== */}
      <div>
        <h1
          className="
            text-[26px]
            font-semibold
            leading-tight
            text-[#f5f0e8]

            sm:text-[28px]
            lg:text-[30px]
          "
        >
          {t("account.title")}
        </h1>

        <p
          className="
            mt-1.5
            text-[13px]
            text-[#999ca1]

            sm:text-[14px]
          "
        >
          {t("account.description")}
        </p>
      </div>

      {/* =========================
          ACCOUNT CARDS
      ========================== */}
      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-5

          lg:mt-8
              lg:grid-cols-2
          lg:gap-5
        "
      >
        {/* =========================
            USER INFORMATION
        ========================== */}
        <section
          className="
            rounded-[14px]
            border
            border-[#403a28]
            bg-[#171c22]
            px-5
            py-5

            sm:px-6
            sm:py-6

            lg:min-h-[285px]
          "
        >
          {/* Card heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#f4f0e9]">
              {t("account.userInformation")}
            </h2>

            <div
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-[8px]
                border
                border-[#51472d]
                bg-[#252a2f]
                text-[#d5af42]
              "
            >
              <UserIcon />
            </div>
          </div>

          {/* Rows */}
          <div className="mt-6">
            <InfoRow
              label={t("account.whatsappNumber")}
              value={accountData.phone}
            />
            <InfoRow
              label={t("account.language")}
              value={accountData.language}
            />
            <InfoRow
              label={t("account.currency")}
              value={accountData.currency}
            />
            <InfoRow
              label={t("account.accountStatus")}
              value={
                <StatusBadge>
                  {translateStatus(t, accountData.accountStatus)}
                </StatusBadge>
              }
            />
            <InfoRow
              label={t("account.userType")}
              value={translateUserType(t, accountData.userType)}
              last
            />
          </div>
        </section>

        {/* =========================
            SUBSCRIPTION INFORMATION
        ========================== */}
        <section
          className="
            rounded-[14px]
            border
            border-[#403a28]
            bg-[#171c22]
            px-5
            py-5

            sm:px-6
            sm:py-6
          "
        >
          {/* Card heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#f4f0e9]">
              {t("account.subscription")}
            </h2>

            <div
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-[8px]
                border
                border-[#51472d]
                bg-[#252a2f]
                text-[#d5af42]
              "
            >
              <CrownIcon />
            </div>
          </div>

          {/* Rows */}
          <div className="mt-6">
            <InfoRow
              label={t("account.currentPlan")}
              value={
                <span className="font-medium text-[#d5af42]">
                  {translatePlan(t, accountData.currentPlan)}
                </span>
              }
            />

            <InfoRow
              label={t("account.subscriptionStatus")}
              value={
                <StatusBadge>
                  {translateStatus(t, accountData.subscriptionStatus)}
                </StatusBadge>
              }
            />

            <InfoRow
              label={t("account.expenseLimit")}
              value={accountData.expenseLimit}
            />

            <InfoRow
              label={t("account.expensesUsed")}
              value={accountData.expensesUsed}
            />

            <InfoRow
              label={t("account.remaining")}
              value={accountData.remainingExpenses}
            />

            <InfoRow
              label={t("account.planStarted")}
              value={accountData.planStarted}
            />

            <InfoRow
              label={t("account.planExpires")}
              value={accountData.planExpires}
              last
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
function formatAccountDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function translateStatus(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const keys = {
    active: "status.active",
    inactive: "status.inactive",
    plan_expired: "status.planExpired",
    banned: "status.banned",
  };
  return keys[key] ? t(keys[key]) : value || "-";
}

function translatePlan(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const keys = {
    free: "plans.free",
    standard: "plans.standard",
    pro: "plans.pro",
  };
  return keys[key] ? t(keys[key]) : value || "-";
}

function translateUserType(t, value) {
  const keys = {
    personal: "account.personal",
    groupAdmin: "account.groupAdmin",
    groupMember: "account.groupMember",
    groupUser: "account.groupUser",
  };
  return keys[value] ? t(keys[value]) : value || "-";
}

/* =========================
   SHARED ROW
========================== */

function InfoRow({ label, value, last = false }) {
  return (
    <div
      className={`
        flex
        min-h-[44px]
        items-center
        justify-between
        gap-4
        py-2

        ${last ? "" : "border-b border-[#30353b]"}
      `}
    >
      <span className="text-[13px] text-[#9a9da2] sm:text-[14px]">{label}</span>

      <div className="text-right text-[13px] font-medium text-[#f0ede7] sm:text-[14px]">
        {value}
      </div>
    </div>
  );
}

/* =========================
   ACTIVE BADGE
========================== */

function StatusBadge({ children }) {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-[5px]
        border
        border-[#236239]
        bg-[#11391f]
        px-2
        py-[3px]
        text-[11px]
        font-medium
        leading-none
        text-[#3fb950]
      "
    >
      {children}
    </span>
  );
}

export default AccountPage;
