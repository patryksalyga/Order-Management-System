<template>
  <div class="card-body p-5">
    <h2 class="text-uppercase text-center mb-5">LOGIN</h2>

    <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ errors, validateField }">
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="username">Username</label>
        <ErrorMessage name="username" class="error-feedback" />
        <Field name="username" type="text" class="form-control form-control-lg" :class="{ 'is-invalid': errors.email }"
          @blur="checkField('usernme', validateField)" />
        
        
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="password">Password</label>
        <ErrorMessage name="password" class="error-feedback" />
        <Field name="password" type="password" class="form-control form-control-lg"
          :class="{ 'is-invalid': errors.password }" @blur="checkField('password', validateField)" />
        
        
      </div>

      <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
        Sign in
      </button>

      <p class="text-center text-muted mt-5 mb-0">
        Not a member?
        <router-link to="/registerpage" class="fw-bold text-body"><u>Register</u></router-link>
      </p>
    </Form>

    <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
      {{ message }}
    </div>
  </div>
</template>
  
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "LoginPage",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      username: yup
        .string()
        .required(" Username is required"),
      password: yup
        .string()
        .required(" Password is required")
    });

    return {
      schema,
      message: "",
      successful: false,
      input: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async checkField(fieldName, validateField) {
      try {
        await validateField(fieldName);
      } catch (error) {
        this.input[fieldName] = ""; // Reset the field value if validation fails
      }
    },
    async handleLogin(values) {
      try {
        await this.$store.dispatch('auth/login', values);
        //await props.method(); // Call the function passed as prop
        this.$router.push('/homepage');
      } catch (error) {
        this.message = error.response.data.message;
        this.successful = false;
      }
    },
  },
};
</script>
  
<style scoped>
.is-invalid {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.error-feedback {
  color: #dc3545;
  font-size: 0.875em;
}

.gradient-custom-4 {
  /* fallback for old browsers */
  background: #84fab0;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
}
</style>
  