import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getUserFullDetails } from "../../services/userService";
import { applyUserLanguage } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { getGroupMembers } from "../../services/groupService";

function GroupPage() {
  const { t } = useTranslation();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = storedUser.user_id;

  const [groupData, setGroupData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGroupDetails() {
      try {
        setLoading(true);
        setError("");

        // =========================================
        // Load normal user/group information
        // =========================================

        const data = await getUserFullDetails(userId);

        const group = data?.group;

        if (!data?.success || data.account_type !== "group" || !group) {
          throw new Error("Group account details were not returned.");
        }

        applyUserLanguage(data.user?.language);

        const groupRole = group.current_user?.role || group.role || "member";

        const isGroupAdmin = String(groupRole).trim().toLowerCase() === "admin";

        // =========================================
        // Default members array
        // =========================================

        let groupMembers = [];

        // =========================================
        // ONLY GROUP ADMIN LOADS MEMBER DETAILS
        // =========================================

        if (isGroupAdmin) {
          const memberData = await getGroupMembers();

          groupMembers = Array.isArray(memberData?.members)
            ? memberData.members
            : [];
        }

        // =========================================
        // Group information
        // =========================================

        setGroupData({
          groupName: cleanText(group.group_name) || "-",

          yourRole: cleanText(groupRole),

          groupPlan: cleanText(data.user?.plan_name) || "-",

          groupStatus: cleanText(group.group_status) || "-",

          members: isGroupAdmin
            ? groupMembers.length
            : (group.members?.length ?? 0),

          groupExpenseUsage: `${
            group.used_limit ?? data.user?.used_limit ?? 0
          } / ${group.monthly_limit ?? data.user?.total_expense_limit ?? 0}`,

          expensesRemaining:
            group.remaining_limit ?? data.user?.remaining_limit ?? 0,

          planExpires: formatAccountDate(data.user?.plan_expires_at),

          phone: cleanText(data.user?.phone),

          role: isGroupAdmin ? "admin" : "member",

          isGroupAdmin,
        });

        // =========================================
        // Members
        // =========================================

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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-[14px] text-[#999ca1]">{t("group.loading")}</div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

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

      {/* =====================================================
          MEMBERS SECTION
          GROUP ADMIN ONLY
      ====================================================== */}

      {groupData.isGroupAdmin && (
        <section className="mt-7 lg:mt-16">
          {/* Heading */}

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

            <p
              className="
                mt-1
                text-[13px]
                text-[#999ca1]

                sm:text-[14px]
              "
            >
              {t("group.membersDescription")}
            </p>
          </div>

          {/* =================================================
              DESKTOP MEMBERS TABLE
          ================================================== */}

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
              {/* =========================
                  TABLE HEADER
              ========================== */}

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
                  {/* Join Date */}
                  <th className="w-[18%] px-6"> Join Date</th>

                  {/* Phone */}
                  <th className="w-[27%] px-4">Member&apos;s Phone No.</th>

                  {/* Role */}
                  <th className="w-[17%] px-4">{t("group.role")}</th>

                  {/* Last Expense Date */}
                  <th className="w-[21%] px-4">Last Expense Date</th>

                  {/* Status */}
                  <th className="w-[17%] px-4">{t("group.status")}</th>
                </tr>
              </thead>

              {/* =========================
                  TABLE BODY
              ========================== */}

              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="
                        h-[62px]
                        border-t
                        border-[#403a28]
                        text-[13px]
                      "
                  >
                    {/* Join Date */}

                    <td className="px-6 text-[#9a9da2]">
                      {member.date || "-"}
                    </td>

                    {/* Member Phone */}

                    <td
                      className="
                          overflow-hidden
                          px-4
                          font-medium
                          text-[#f1eee8]
                        "
                    >
                      <div className="truncate">{member.whatsapp || "-"}</div>
                    </td>

                    {/* Role */}

                    <td className="px-4">
                      <span
                        className={`
                            inline-flex
                            rounded-[6px]
                            border
                            px-2
                            py-1
                            text-[11px]
                            font-medium

                            ${
                              String(member.role).toLowerCase() === "admin"
                                ? "border-[#5f5330] bg-[#373424] text-[#d5af42]"
                                : "border-[#51555b] bg-[#30343a] text-[#b4b6ba]"
                            }
                          `}
                      >
                        {translateRole(t, member.role)}
                      </span>
                    </td>

                    {/* Last Expense Date */}

                    <td className="px-4 text-[#9a9da2]">
                      {member.lastExpenseDate || "-"}
                    </td>

                    {/* Status */}

                    <td className="px-4">
                      <MemberStatusBadge status={member.status}>
                        {translateStatus(t, member.status)}
                      </MemberStatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* =========================
                DESKTOP FOOTER
            ========================== */}

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

          {/* =================================================
              MOBILE MEMBER CARDS
          ================================================== */}

          <div className="mt-4 space-y-3 lg:hidden">
            {members.map((member) => (
              <article
                key={member.id}
                className="
                    rounded-[12px]
                    border
                    border-[#403a28]
                    bg-[#171c22]
                    px-4
                    py-4
                  "
              >
                {/* =========================
                      DATE + STATUS
                  ========================== */}

                <div
                  className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                >
                  <div>
                    <span
                      className="
                          block
                          text-[10px]
                          uppercase
                          tracking-wide
                          text-[#6f7378]
                        "
                    >
                      Date
                    </span>

                    <span
                      className="
                          mt-1
                          block
                          text-[12px]
                          text-[#9a9da2]
                        "
                    >
                      {member.date || "-"}
                    </span>
                  </div>

                  <MemberStatusBadge status={member.status}>
                    {translateStatus(t, member.status)}
                  </MemberStatusBadge>
                </div>

                {/* =========================
                      PHONE NUMBER
                  ========================== */}

                <div className="mt-4">
                  <span
                    className="
                        block
                        text-[10px]
                        uppercase
                        tracking-wide
                        text-[#6f7378]
                      "
                  >
                    Member&apos;s Phone No.
                  </span>

                  <span
                    className="
                        mt-1
                        block
                        truncate
                        text-[15px]
                        font-medium
                        text-[#f4f0e9]
                      "
                  >
                    {member.whatsapp || "-"}
                  </span>
                </div>

                {/* =========================
                      ROLE
                  ========================== */}

                <div
                  className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                >
                  <span className="text-[13px] text-[#92959a]">
                    {t("group.role")}
                  </span>

                  <span
                    className={`
                        inline-flex
                        rounded-[6px]
                        border
                        px-2
                        py-1
                        text-[11px]
                        font-medium

                        ${
                          String(member.role).toLowerCase() === "admin"
                            ? "border-[#5f5330] bg-[#373424] text-[#d5af42]"
                            : "border-[#51555b] bg-[#30343a] text-[#b4b6ba]"
                        }
                      `}
                  >
                    {translateRole(t, member.role)}
                  </span>
                </div>

                {/* Divider */}

                <div className="my-3 h-px bg-[#30353b]" />

                {/* =========================
                      LAST EXPENSE DATE
                  ========================== */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                >
                  <span className="text-[13px] text-[#92959a]">
                    Last Expense Date
                  </span>

                  <span
                    className="
                        text-[13px]
                        font-medium
                        text-[#d5af42]
                      "
                  >
                    {member.lastExpenseDate || "-"}
                  </span>
                </div>
              </article>
            ))}

            {/* =========================
                MOBILE FOOTER
            ========================== */}

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
      )}
    </DashboardLayout>
  );
}

/* =========================================================
   MAP MEMBER DATA
========================================================= */

function mapMember(member, index) {
  const rawStatus = cleanText(
    member.membership_status || member.status || "active",
  ).toLowerCase();

  const displayStatus = rawStatus === "active" ? "active" : "inactive";

  return {
    /* Member ID */
    id: member.id || member.user_id || member.member_id || index,

    /* Member Join Date */
    date: formatAccountDate(
      member.date_of_join ||
        member.created_at ||
        member.joined_at ||
        member.date,
    ),

    /* Member Phone Number */
    whatsapp:
      cleanText(member.phone_number || member.phone || member.whatsapp) || "-",

    /* Member Role */
    role: cleanText(member.member_type || member.role) || "-",

    /* Last Expense / Last Use Date */
    lastExpenseDate: formatAccountDate(member.last_use),

    /* Only Active / Inactive shown in dashboard */
    status: displayStatus,
  };
}

/* =========================================================
   TRANSLATE ROLE
========================================================= */

function translateRole(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();

  const keys = {
    admin: "roles.admin",

    member: "roles.member",
  };

  return keys[key] ? t(keys[key]) : value || "-";
}

/* =========================================================
   TRANSLATE STATUS
========================================================= */

function translateStatus(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();

  const keys = {
    active: "status.active",
    inactive: "status.inactive",
  };

  return keys[key] ? t(keys[key]) : value || "-";
}

/* =========================================================
   TRANSLATE PLAN
========================================================= */

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

/* =========================================================
   FORMAT DATE
========================================================= */

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

/* =========================================================
   CLEAN TEXT
========================================================= */

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
   STATUS BADGE
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
   MEMBER STATUS BADGE
========================================== */

function MemberStatusBadge({ status, children }) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  const style =
    value === "active"
      ? "border-[#236239] bg-[#11391f] text-[#3fb950]"
      : "border-[#7a3b3b] bg-[#3a1f1f] text-[#ff8a8a]";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-[6px]
        border
        px-2
        py-1
        text-[11px]
        font-medium
        ${style}
      `}
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

export default GroupPage;
