import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Dashboard } from "./pages/Dashboard";
import { Agendamentos } from "./pages/Agendamentos";
import { Triagem } from "./pages/Triagem";
import { Historico } from "./pages/Historico";
import { Vacinacao } from "./pages/Vacinacao";
import { Perfil } from "./pages/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/cadastro",
    Component: Cadastro,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/agendamentos",
    Component: Agendamentos,
  },
  {
    path: "/triagem",
    Component: Triagem,
  },
  {
    path: "/historico",
    Component: Historico,
  },
  {
    path: "/vacinacao",
    Component: Vacinacao,
  },
  {
    path: "/perfil",
    Component: Perfil,
  },
]);