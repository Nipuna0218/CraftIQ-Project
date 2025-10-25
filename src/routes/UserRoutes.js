// src/routes/UserRoutes.js
import AddLearningPlan from '../components/learningPlane/AddLearningPlan';
import About from '../views/About';
import Blog from '../views/Blog';
import Categori from '../views/Categori';
import EditLearningPlane from '../views/EditLearningPlane';
import Elements from '../views/Elements';
import FeeadbackManagment from '../views/FeeadbackManagment';
import FindUser from '../views/FindUser';
import Follower from '../views/Follower';
import Following from '../views/Following';
import Home from '../views/Home';
import LearningPlane from '../views/LearningPlane';
import LearningPlaneCreate from '../views/LearningPlaneCreate';
import ProgressView from '../views/ProgressView';
import SkillPost from '../views/SkillPost';
import SkillPostDetails from '../views/SkillPostDetails';
import SkillPostEdit from '../views/SkillPostEdit';
import SkillPostView from '../views/SkillPostView';
import UserEdit from '../views/UserEdit';
import UserProfile from '../views/UserProfile';
import ViewSkillPost from '../views/ViewSkillPost';

const UserRoutes = [
  {
    path: "/home",
    name: "Home",
    component: Home, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/about",
    name: "About",
    component: About, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/categori",
    name: "Categori",
    component: Categori, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/elements",
    name: "Elements",
    component: Elements, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/user-profile",
    name: "UserProfile",
    component: UserProfile, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/user-edit",
    name: "UserEdit",
    component: UserEdit, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/skillPost",
    name: "SkillPost",
    component: SkillPost, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/viewSkillPost",
    name: "viewSkillPost",
    component: ViewSkillPost, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/editSkillPost/:id",
    name: "editSkillPost",
    component: SkillPostEdit, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/plane-create",
    name: "Plane Skill",
    component: LearningPlaneCreate, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/learning-plane",
    name: "Plane Skill",
    component: LearningPlane, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/feedback-managment",
    name: "feedback managment",
    component: FeeadbackManagment, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/find-user",
    name: "Find User ",
    component: FindUser, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/skill-post-view",
    name: "View Post  ",
    component: SkillPostView, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/edit-learning-plane/:id",
    name: "Edit learning plane   ",
    component: EditLearningPlane, 
    layout: "/user",
    hidden: false,
  },
  {
    path: "/skill-post-details/:id",
    name: "Skill Post details  ",
    component: SkillPostDetails, 
    layout: "/user",
    hidden: false,
  },
    {
    path: "/follower",
    name: "Followers  ",
    component: Follower, 
    layout: "/user",
    hidden: false,
  },
   {
    path: "/progress-view",
    name: "progress view  ",
    component: ProgressView, 
    layout: "/user",
    hidden: false,
  },
   {
    path: "/following",
    name: "following  ",
    component: Following, 
    layout: "/user",
    hidden: false,
  },


];

export default UserRoutes;
