import React from "react";
import LoginForm from "./LoginForm";
import ItemsList from "./Components/ItemsList";
import ItemDetails from "./Components/ItemDetails";
import ItemCreateForm from "./Components/ItemCreateForm";
import ItemEditForm from "./Components/ItemEditForm";
import AfterCarritoList from "./Components/AfterCarritoList";
import withRouter from "./Components/withRouter";

import MyItemsTable from "./Components/MyItemsTable";
import BookingCreateForm from "./Components/BookingCreateForm";
import BookingsList from "./Components/BookingsList";
import { Layout, Menu } from "antd";
import { createClient } from "@supabase/supabase-js";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import {
  CoffeeOutlined,
  FireOutlined,
  LoginOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { Avatar, Typography } from "antd";
import OrderList from "./Components/OrdersList";
import { UserAddOutlined } from "@ant-design/icons";
import { LogoutOutlined, CarryOutOutlined } from "@ant-design/icons";

import SignUp from "./Components/SignUp";
import AllOrdersList from "./Components/AllOrdersList";

class App extends React.Component {
  constructor(props) {
    super(props);

    // opcional para poder personalizar diferentes aspectos
    const options = {
      schema: "public",
      headers: { "x-my-custom-header": "my-app-name" },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    };

    const supabase = createClient(
      "https://pxdzokovubskxtsaefra.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZHpva292dWJza3h0c2FlZnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEzNzE4MjksImV4cCI6MTk5Njk0NzgyOX0.fzw4DBGWnfNvhHXZyAL_z0Y5Tr_5kF4hCRetSDyKaA0",
      options
    );

    this.supabase = supabase;

    // Configuración Inicial del estado
    this.state = {
      user: null,
      isAdmin: false,
    };
  }

  viewItemsMenu = async (prevState) => {
    const { data, error } = await this.supabase
      .from("role")
      .select("*")
      .eq("user", this.state.user.email);

    if (data != null) {
      this.setState({
        isAdmin: data?.[0]?.admin,
      });
    }
  };

  componentDidUpdate = async (prevProp, prevState) => {
    if (prevState.user !== this.state.user) {
      this.viewItemsMenu(prevState);
    }
  };

  componentDidMount = async () => {
    if (this.state.user == null) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();

      if (user != null) {
        this.setState({
          user: user,
        });
        this.viewItemsMenu();
      }
    }
  };

  callBackOnFinishLoginForm = async (loginUser) => {
    // signUn, Registro de usuario
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    });

    if (error == null && data.user != null) {
      this.setState({
        user: data.user,
      });

      this.props.navigate("/items");
    }
  };
  callBackOnFinishSignUpForm = async (signUpUser) => {
    const { data, error } = await this.supabase.auth.signUp({
      email: signUpUser.email,
      password: signUpUser.password,
    });

    if (error == null && data.user != null) {
      this.setState({
        user: data.user,
      });

      this.props.navigate("/items");
    }
  };
  handleLogout = async () => {
    await this.supabase.auth.signOut();
    this.setState({ user: null });
    // Redirige al usuario a la página de inicio de sesión ("/")
    this.props.navigate("/");
  };

  render() {
    const { Text } = Typography;
    const { Header, Footer, Sider, Content } = Layout;

    let menuItems = this.state.isAdmin
      ? [
          {
            key: "logo",
            label: <img src="/logo.png" width="40" height="40" />,
          },
          {
            key: "menuLogin",
            label: (
              <Link to="/" style={{ color: "#ffffff" }}>
                Login
              </Link>
            ),
            icon: <LoginOutlined />,
            anon: true,
            auth: false,
          },
          {
            key: "signup",
            anon: true,
            auth: false,
            paths: ["/signup"],
            label: (
              <Link to="/signup" style={{ color: "#ffffff" }}>
                Registrarse
              </Link>
            ),
            icon: <UserAddOutlined />,
            anon: true,
            auth: false,
          },
          {
            key: "auth_createItem",
            label: (
              <Link to="/item/create" style={{ color: "#ffffff" }}>
                Agregar plato
              </Link>
            ),
            icon: <CoffeeOutlined />,
            anon: false,
            auth: true,
          },
          {
            key: "auth_userItems",
            label: (
              <Link to="/userItems" style={{ color: "#ffffff" }}>
                Mis platos
              </Link>
            ),
            icon: <FireOutlined />,
            anon: false,
            auth: true,
          },
          {
            key: "allOrders",
            label: (
              <Link to="/allOrders" style={{ color: "#ffffff" }}>
                Pedidos
              </Link>
            ),
            icon: <CarryOutOutlined />,
            anon: false,
            auth: true,
          },
          {
            key: "logout",
            label: (
              <Link
                to="/items"
                onClick={this.handleLogout}
                style={{ color: "#ffffff" }}
              >
                Log out
              </Link>
            ),
            icon: <LogoutOutlined />,
            anon: false,
            auth: true,
          },
        ]
      : [
          {
            key: "logo",
            label: <img src="/logo.png" width="40" height="40" />,
          },
          {
            key: "menuItems",
            label: (
              <Link to="/items" style={{ color: "#ffffff" }}>
                Menu
              </Link>
            ),
            icon: <MenuOutlined />,
            anon: true,
            auth: true,
          },
          {
            key: "menuLogin",
            label: (
              <Link to="/" style={{ color: "#ffffff" }}>
                Login
              </Link>
            ),
            icon: <LoginOutlined />,
            anon: true,
            auth: false,
          },
          {
            key: "signup",
            anon: true,
            auth: false,
            paths: ["/signup"],
            label: (
              <Link to="/signup" style={{ color: "#ffffff" }}>
                Registrarse
              </Link>
            ),
            icon: <UserAddOutlined />,
            anon: true,
            auth: false,
          },
          {
            key: "booking",
            label: (
              <Link to="/booking" style={{ color: "#ffffff" }}>
                Reservar
              </Link>
            ),
            icon: <CalendarOutlined />,
            anon: false,
            auth: true,
          },

          {
            key: "orders",
            label: (
              <Link to="/orders" style={{ color: "#ffffff" }}>
                Mi carrito
              </Link>
            ),
            icon: <ShoppingCartOutlined />,
            anon: true,
            auth: true,
          },
          {
            key: "Mybookings",
            label: (
              <Link to="/userBookings" style={{ color: "#ffffff" }}>
                Mis reservas
              </Link>
            ),
            icon: <BookOutlined />,
            anon: false,
            auth: true,
          },
          {
            key: "Myorders",
            label: (
              <Link to="/userOrders" style={{ color: "#ffffff" }}>
                Pedidos
              </Link>
            ),
            icon: <CarryOutOutlined />,
            anon: false,
            auth: true,
          },
          {
            key: "logout",
            label: (
              <Link
                to="/items"
                onClick={this.handleLogout}
                style={{ color: "#ffffff" }}
              >
                Log out
              </Link>
            ),
            icon: <LogoutOutlined />,
            anon: false,
            auth: true,
          },
        ];

    if (this.state.user === undefined) {
      menuItems = menuItems.filter((item) => item.anon && item.auth);
    } else if (this.state.user === null) {
      menuItems = menuItems.filter((item) => item.anon);
    } else {
      menuItems = menuItems.filter((item) => item.auth);
    }
    menuItems = menuItems.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      paths: item.paths,
      path: item.path,
    }));

    return (
      <Layout className="layout">
        <Header>
          <Row>
            <Col xs={18} sm={19} md={20} lg={21} xl={22}>
              <div className="logo" />
              <Menu theme="dark" mode="horizontal">
                {menuItems.map((item) => (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col
              xs={6}
              sm={5}
              md={4}
              lg={3}
              xl={2}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              {this.state.user != null ? (
                <Avatar
                  size="large"
                  style={{
                    backgroundColor: "#FECBC1",
                    color: "#000000",
                    marginTop: 12,
                  }}
                >
                  {this.state.user.email.charAt(0)}
                </Avatar>
              ) : (
                <Text style={{ color: "#ffffff" }}>Login</Text>
              )}
            </Col>
          </Row>
        </Header>

        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Row style={{ marginTop: 34 }}>
              <Col span={24}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <LoginForm
                        callBackOnFinishLoginForm={
                          this.callBackOnFinishLoginForm
                        }
                      />
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <SignUp
                        callBackOnFinishSignUpForm={
                          this.callBackOnFinishSignUpForm
                        }
                      />
                    }
                  />

                  <Route
                    path="/items"
                    element={<ItemsList supabase={this.supabase} />}
                  />
                  <Route
                    path="/item/:id"
                    element={<ItemDetails supabase={this.supabase} />}
                  />
                  <Route
                    path="/item/create"
                    element={<ItemCreateForm supabase={this.supabase} />}
                  />
                  <Route
                    path="/userItems"
                    element={<MyItemsTable supabase={this.supabase} />}
                  />
                  <Route
                    path="/edit/item/:id"
                    element={<ItemEditForm supabase={this.supabase} />}
                  />
                  <Route
                    path="/orders"
                    element={<OrderList supabase={this.supabase} />}
                  />
                  <Route
                    path="/allOrders"
                    element={<AllOrdersList supabase={this.supabase} />}
                  />
                  <Route
                    path="/booking"
                    element={<BookingCreateForm supabase={this.supabase} />}
                  />
                  <Route
                    path="/userbookings"
                    element={<BookingsList supabase={this.supabase} />}
                  />
                  <Route
                    path="/userOrders"
                    element={<AfterCarritoList supabase={this.supabase} />}
                  />
                </Routes>
              </Col>
            </Row>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}> La Dolce Vita </Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
