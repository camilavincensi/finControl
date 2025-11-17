# Recreate file and return it to user
content = """# 💰 FinControl

FinControl é um aplicativo mobile de **controle financeiro pessoal**, desenvolvido em **React Native + Expo**, com backend em **Firebase**.  
Nosso objetivo é oferecer uma solução simples, prática e automatizada para que o usuário organize suas finanças, controle entradas e saídas, receba alertas e tenha mais consciência do próprio dinheiro.

---

## 🚀 Funcionalidades

- 🔐 **Autenticação de usuário** (Firebase Auth)
- 💸 **Cadastro de receitas e despesas**
- 🏷️ **Categorias personalizáveis**
- 🔔 **Notificações push** para alertas financeiros
- 📂 **Histórico de alertas armazenado no Firestore**
- 📊 **Dashboard com saldo, total de entradas e saídas**
- 👤 **Tela de configurações e perfil do usuário**

---

## 🧠 Como funcionam os alertas

O app monitora as transações do usuário em tempo real utilizando **onSnapshot** (Firestore).  
Quando uma **despesa ultrapassa o limite configurado**, o FinControl:

1. Envia uma **notificação push via Expo Notifications**
2. Registra o alerta no **Histórico de Alertas** no Firestore
3. Exibe no app para consulta posterior

## 🛠️ Tecnologias e Bibliotecas

| Tecnologia | Uso |
|-----------|-----|
| React Native | Base mobile |
| Expo | Build e notificações |
| Firebase Authentication | Login/Cadastro |
| Firestore | Banco de dados |
| Expo Notifications | Push notifications |
| Context API + Hooks | Estado global |

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```