import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { api } from "../../services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm } from "react-hook-form";

import {
  Container,
  Title,
  Column,
  TitleLogin,
  EsqueciText,
  Row,
  Wrapper,
  EntrarText,
} from "./styles";

const schema = yup
  .object({
    name: yup.string().required("Nome obrigatório"),
    email: yup.string().email().required("Email obrigatório"),
    senha: yup
      .string()
      .min(6, "Minimo de 6 caracteres")
      .required("Senha obrigatória"),
  })
  .required();

const Register = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      const userData = await api.get(`/users?email=${formData.email}`);
      if (userData?.data[0]?.email) {
        alert("E-mail já cadastrado");
      } else {
        try {
          const user = {
            name: formData.name,
            email: formData.email,
            senha: formData.senha,
          };
          const { data } = await api.post("/users", user);

          if (data?.id) {
            alert(
              "Cadastro realizado com sucesso! Redirecionando para sua conta..."
            );
            setTimeout(() => {
              navigate("/feed");
            }, 3000);
          }
        } catch (error) {
          console.error(error);
          alert("Erro ao cadastrar usuário");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Column>
          <Title>
            A plataforma para você aprender com experts, dominar as principais
            tecnologias e entrar mais rápido nas empresas mais desejadas.
          </Title>
        </Column>
        <Column>
          <Wrapper>
            <TitleLogin>Faça seu cadastro</TitleLogin>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder="Nome"
                leftIcon={<MdPerson />}
                name="name"
                control={control}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}

              <Input
                placeholder="E-mail"
                leftIcon={<MdEmail />}
                name="email"
                control={control}
              />
              {errors.email && (
                <p className="error-message">E-mail é obrigatório</p>
              )}

              <Input
                type="password"
                placeholder="Senha"
                leftIcon={<MdLock />}
                name="senha"
                control={control}
              />
              {errors.senha && (
                <p className="error-message">Senha é obrigatório</p>
              )}

              <Button title="Cadastrar" variant="secondary" type="submit" />
            </form>
            <Row>
              <EsqueciText>Esqueci minha senha</EsqueciText>
              <EntrarText onClick={() => navigate("/login")}>Entrar</EntrarText>
            </Row>
          </Wrapper>
        </Column>
      </Container>
    </>
  );
};

export { Register };
