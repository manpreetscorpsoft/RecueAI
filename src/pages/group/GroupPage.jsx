import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getUserFullDetails } from "../../services/userService";
import { applyUserLanguage } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";

function GroupPage() {
  const { t } = useTranslation();
  const userId = 250;
  const [groupData, setGroupData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGroupDetails() {
      try {
        const data = await getUserFullDetails(userId);
        const group = data?.group;

        if (!data?.success || data.account_type !== "group" || !group) {
          throw new Error("Group account details were not returned.");
        }

        applyUserLanguage(data.user?.language);

        const groupRole = group.current_user?.role || group.role || "member";
        const groupMembers = Array.isArray(group.members) ? group.members : [];

        setGroupData({
          groupName: cleanText(group.group_name) || "-",
          yourRole: cleanText(groupRole),
          groupPlan: cleanText(data.user?.plan_name) || "-",
          groupStatus: cleanText(group.group_status) || "-",
          members: groupMembers.length,
          groupExpenseUsage: `${group.used_limit ?? data.user?.used_limit ?? 0} / ${group.monthly_limit ?? data.user?.total_expense_limit ?? 0}`,
          expensesRemaining:
            group.remaining_limit ?? data.user?.remaining_limit ?? 0,
          planExpires: formatAccountDate(data.user?.plan_expires_at),
          phone: cleanText(data.user?.phone),
          role: groupRole === "member" ? "member" : "admin",
        });

        setMembers(groupMembers.map(mapMember));
      } catch (err) {
        console.error("Unable to load group details:", err);
        setError("Unable to load group information.");
      } finally {
        setLoading(false);
      }
    }

    loadGroupDetails();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-[14px] text-[#999ca1]">{t("group.loading")}</div>
      </DashboardLayout>
    );
  }

  if (error || !groupData) {
    return (
      <DashboardLayout>
        <div className="text-[14px] text-red-400">
          {error ? t("group.loadError") : t("group.empty")}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={groupData.role} phone={groupData.phone}>
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
          {t("group.groupAccount")}
        </h1>

        <p
          className="
            mt-1.5
            text-[13px]
            text-[#999ca1]

            sm:text-[14px]
          "
        >
          {t("group.description")}
        </p>
      </div>

      {/* =========================
          GROUP INFORMATION
      ========================== */}
      <section
        className="
          mt-6
          rounded-[14px]
          border
          border-[#403a28]
          bg-[#171c22]
          px-5
          py-5

          sm:px-6
          sm:py-6

          lg:mt-8
          lg:px-8
          lg:py-7
        "
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#f4f0e9] lg:text-[18px]">
            {t("group.groupInformation")}
          </h2>

          <div
            className="
              flex
              h-[34px]
              w-[34px]
              shrink-0
              items-center
              justify-center
              rounded-[8px]
              border
              border-[#51472d]
              bg-[#252a2f]
              text-[#d5af42]
            "
          >
            <GroupIcon />
          </div>
        </div>

        {/* Information Rows */}
        <div className="mt-6">
          <InfoRow label={t("group.groupName")} value={groupData.groupName} />

          <InfoRow
            label={t("group.yourRole")}
            value={translateRole(t, groupData.yourRole)}
          />

          <InfoRow
            label={t("group.groupPlan")}
            value={
              <span className="font-medium text-[#d5af42]">
                {translatePlan(t, groupData.groupPlan)}
              </span>
            }
          />

          <InfoRow
            label={t("group.groupStatus")}
            value={
              <StatusBadge>
                {translateStatus(t, groupData.groupStatus)}
              </StatusBadge>
            }
          />

          <InfoRow label={t("group.members")} value={groupData.members} />

          <InfoRow
            label={t("group.usedLimit")}
            value={groupData.groupExpenseUsage}
          />

          <InfoRow
            label={t("group.remainingLimit")}
            value={groupData.expensesRemaining}
          />

          <InfoRow
            label={t("account.planExpires")}
            value={groupData.planExpires}
            last
          />
        </div>
      </section>

      {/* =========================
          MEMBERS SECTION
      ========================== */}
      <section className="mt-7 lg:mt-16">
        <div>
          <h2
            className="
              text-[20px]
              font-semibold
              text-[#f5f0e8]

              lg:text-[28px]
            "
          >
            {t("group.membersSection")}
          </h2>

          <p className="mt-1 text-[13px] text-[#999ca1] sm:text-[14px]">
            {t("group.membersDescription")}
          </p>
        </div>

        {/* =========================
            DESKTOP TABLE
        ========================== */}
        <div
          className="
            mt-6
            hidden
            overflow-hidden
            rounded-[14px]
            border
            border-[#403a28]
            bg-[#171c22]

            lg:block
          "
        >
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-[#2a2f34]">
              <tr
                className="
                  h-[52px]
                  text-left
                  text-[11px]
                  font-medium
                  uppercase
                  text-[#a5a7aa]
                "
              >
                <th className="w-[16%] px-6">{t("expenseList.date")}</th>

                <th className="w-[17%] px-4">{t("group.member")}</th>

                <th className="w-[18%] px-4">{t("group.whatsapp")}</th>

                <th className="w-[16%] px-4">{t("group.role")}</th>

                <th className="w-[16%] px-4">{t("group.expenses")}</th>

                <th className="w-[17%] px-4">{t("group.status")}</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="
                    h-[62px]
                    border-t
                    border-[#403a28]
                    text-[13px]
                    text-[#9a9da2]
                  "
                >
                  <td className="px-6">{member.date}</td>

                  <td className="px-4">{member.name}</td>

                  <td className="px-4">{member.whatsapp}</td>

                  <td className="px-4">{translateRole(t, member.role)}</td>

                  <td className="px-4">{member.expenses}</td>

                  <td className="px-4">
                    <span className="underline underline-offset-2">
                      {translateStatus(t, member.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop Footer */}
          <div
            className="
              flex
              min-h-[68px]
              items-center
              justify-between
              border-t
              border-[#403a28]
              px-5
            "
          >
            <p className="text-[12px] text-[#8f9297]">
              {t("group.showingMembers", {
                shown: members.length,
                total: members.length,
              })}
            </p>

            <Pagination />
          </div>
        </div>

        {/* =========================
            MOBILE MEMBER CARDS
        ========================== */}
        <div className="mt-4 space-y-3 lg:hidden">
          {members.map((member) => (
            <article
              key={member.id}
              className="
                rounded-[12px]
                border
                border-[#403a28]
                bg-[#171c22]
                px-3
                py-3
              "
            >
              {/* Name + status */}
              <div className="flex items-center justify-between gap-4">
                <h3
                  className="
                    min-w-0
                    truncate
                    text-[16px]
                    font-semibold
                    text-[#f4f0e9]
                  "
                >
                  {member.name}
                </h3>

                <div
                  className="
                    flex
                    h-[21px]
                    w-[28px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[5px]
                    border
                    border-[#21673a]
                    bg-[#103720]
                    text-[#3fb950]
                  "
                >
                  <CheckIcon />
                </div>
              </div>

              {/* WhatsApp */}
              <MobileInfoRow
                label={t("group.whatsapp")}
                value={member.whatsapp}
              />

              {/* Role */}
              <MobileInfoRow
                label={t("group.role")}
                value={translateRole(t, member.role)}
              />

              {/* Divider */}
              <div className="my-2 h-px bg-[#30353b]" />

              {/* Expense count */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] text-[#92959a]">
                  {t("group.expensesRecorded")}
                </span>

                <span className="text-[14px] font-medium text-[#d5af42]">
                  {member.expenses}
                </span>
              </div>
            </article>
          ))}

          {/* Mobile Pagination */}
          <div className="pt-5">
            <p className="text-center text-[12px] text-[#8f9297]">
              {t("group.showingMembers", {
                shown: Math.min(5, members.length),
                total: members.length,
              })}
            </p>

            <div className="mt-4 flex justify-center">
              <Pagination />
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function mapMember(member, index) {
  return {
    id: member.id || member.user_id || member.member_id || index,
    date: formatAccountDate(
      member.created_at || member.joined_at || member.date,
    ),
    name: cleanText(member.name || member.full_name || member.user_name) || "-",
    whatsapp: cleanText(member.phone || member.whatsapp) || "-",
    role: cleanText(member.role) || "-",
    expenses: member.expenses ?? member.expense_count ?? 0,
    status: cleanText(member.status || "active"),
  };
}

function translateRole(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const keys = { admin: "roles.admin", member: "roles.member" };
  return keys[key] ? t(keys[key]) : value || "-";
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

/* ==========================================
   GROUP INFORMATION ROW
========================================== */

function InfoRow({ label, value, last = false }) {
  return (
    <div
      className={`
        flex
        min-h-[44px]
        items-center
        justify-between
        gap-5
        py-2

        ${last ? "" : "border-b border-[#30353b]"}
      `}
    >
      <span className="text-[13px] text-[#9a9da2] sm:text-[14px]">{label}</span>

      <div
        className="
          max-w-[55%]
          text-right
          text-[13px]
          font-medium
          text-[#f0ede7]

          sm:text-[14px]
        "
      >
        {value}
      </div>
    </div>
  );
}

/* ==========================================
   MOBILE MEMBER ROW
========================================== */

function MobileInfoRow({ label, value }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-4">
      <span className="text-[13px] text-[#92959a]">{label}</span>

      <span
        className="
          max-w-[65%]
          truncate
          text-right
          text-[13px]
          text-[#f1eee8]
        "
      >
        {value}
      </span>
    </div>
  );
}

/* ==========================================
   STATUS
========================================== */

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

/* ==========================================
   PAGINATION
========================================== */

function Pagination() {
  return (
    <div className="flex items-center gap-2">
      <PaginationButton>‹</PaginationButton>

      <PaginationButton active>1</PaginationButton>

      <PaginationButton>2</PaginationButton>

      <PaginationButton>3</PaginationButton>

      <PaginationButton>›</PaginationButton>
    </div>
  );
}

function PaginationButton({ children, active = false }) {
  return (
    <button
      type="button"
      className={`
        flex
        h-8
        min-w-8
        items-center
        justify-center
        rounded-[6px]
        border
        px-2
        text-[12px]

        ${
          active
            ? "border-[#5b4d24] bg-[#353226] text-[#d5af42]"
            : "border-[#484337] bg-[#20252a] text-[#9a9da2]"
        }
      `}
    >
      {children}
    </button>
  );
}

/* ==========================================
   ICONS
========================================== */

function GroupIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[19px] w-[19px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />

      <path d="M3 20v-2a5 5 0 0 1 10 0v2" strokeLinecap="round" />

      <path d="M14 14.5a4.5 4.5 0 0 1 6 4.25V20" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[14px] w-[14px]"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="m6 12 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default GroupPage;
