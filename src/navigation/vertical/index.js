import router from "@/router";
import ls from "localstorage-slim";

const auth = ls.get("user-info", { decrypt: true });
if (!auth) {
  router.push("/");
}

var route = [
  {
    title: "Dashboard",
    to: { name: "dashboard" },
    icon: { icon: "tabler-smart-home" },
  },
];

const manageConferenceTag = {
  title: "Conference Tag",
  to: null,
  icon: { icon: "tabler-user" },
  children: [
    {
      title: "Add",
      to: { name: "conferenceTag-add" },
    },
    {
      title: "List",
      to: { name: "conferenceTag-list" },
    },
  ],
};

route.push(manageConferenceTag);

const manageConferenceType = {
  title: "Conference Type",
  to: null,
  icon: { icon: "tabler-user" },
  children: [
    {
      title: "Add",
      to: { name: "conferenceType-add" },
    },
    {
      title: "List",
      to: { name: "conferenceType-list" },
    },
  ],
};

route.push(manageConferenceType);

const manageConference = {
  title: "Conference",
  to: null,
  icon: { icon: "tabler-user" },
  children: [
    {
      title: "Add",
      to: { name: "conference-add" },
    },
    {
      title: "List",
      to: { name: "conference-list" },
    },
  ],
};

route.push(manageConference);

if (auth.role == 1) {
  const manageSiteSetting = {
    title: "Site Setting",
    to: { name: "siteSetting" },
    icon: { icon: "tabler-settings" },
  };
  route.push(manageSiteSetting);

  const manageUser = {
    title: "User",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "List",
        to: { name: "user-list" },
      },
    ],
  };
  route.push(manageUser);
}

export default route;
