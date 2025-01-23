<template>
    <div class="card-body p-5">
      <h2 class="text-uppercase text-center mb-5">Create an account</h2>
  
      <Form @submit="register" :validation-schema="schema" v-slot="{ errors, validateField }">
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="name">Your Name</label>
          <ErrorMessage name="name" class="error-feedback" />
          <Field
            name="name"
            type="text"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': errors.name }"
            @blur="checkField('name', validateField)"
          />
        </div>
  
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="email">Your Email</label>
          <ErrorMessage name="email" class="error-feedback" />
          <Field
            name="email"
            type="email"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': errors.email }"
            @blur="checkField('email', validateField)"
          />
        </div>
  
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="passwd">Password</label>
          <ErrorMessage name="passwd" class="error-feedback" />
          <Field
            name="passwd"
            type="password"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': errors.passwd }"
            @blur="checkField('passwd', validateField)"
          />
          
        </div>
  
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="passwd2">Repeat your password</label>
          <ErrorMessage name="passwd2" class="error-feedback" />
          <Field
            name="passwd2"
            type="password"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': errors.passwd2 }"
            @blur="checkField('passwd2', validateField)"
          />
          
        </div>
  
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="number">Your Number</label>
          <ErrorMessage name="number" class="error-feedback" />
          <Field
            name="number"
            type="text"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': errors.number }"
            @blur="checkField('number', validateField)"
          />
          
        </div>
  
        <div class="d-flex justify-content-center">
          <button
            type="submit"
            data-mdb-button-init
            data-mdb-ripple-init
            class="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
          >
            Register
          </button>
        </div>
      </Form>
  
      <p class="text-center text-muted mt-5 mb-0">
        Have already an account?
        <router-link to="/loginpage" class="fw-bold text-body"><u>Login here</u></router-link>
      </p>
  
      <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
    </div>
  </template>
  
  


  <script>
  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";
  
  export default {
    name: "RegisterPage",
    components: {
      Form,
      Field,
      ErrorMessage,
    },
    data() {
      const schema = yup.object({
        name: yup
          .string()
          .required(" Username is required")
          .min(3, " Username must be at least 3 characters")
          .max(20, " Username cannot exceed 20 characters"),
        email: yup
          .string()
          .required(" Email is required")
          .email(" Email must be valid")
          .max(50, " Email cannot exceed 50 characters"),
        passwd: yup
          .string()
          .required(" Password is required")
          .min(3, " Password must be at least 3 characters")
          .max(40, " Password cannot exceed 40 characters"),
        passwd2: yup
          .string()
          .oneOf([yup.ref("passwd")], " Passwords must match")
          .required(" Confirm Password is required"),
        number: yup
          .string()
          .required(" Phone number is required")
          .matches(/^\d{9}$/, " Phone number must be exactly 9 digits"),
      });
  
      return {
        schema,
        message: "",
        successful: false,
        input: {
          name: "",
          email: "",
          passwd: "",
          passwd2: "",
          number: "",
        },
      };
    },
    methods: {
      async checkField(fieldName, validateField) {
        try {
          await validateField(fieldName);
        } catch (error) {
          this.input[fieldName] = ""; // Reset field value if validation fails
        }
      },
      async register(values) {
        try {
        await this.$store.dispatch('auth/register', values);
        this.$router.push('/loginpage');
      } catch (error) {
        this.message = error.response.data.message;
        this.successful = false;
      }
      },
    },
  };
  </script>
  
  

<style scoped>
.gradient-custom-4 {
    /* fallback for old browsers */
    background: #84fab0;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1))
}

.is-invalid {
  border-color: #dc3545;
  background-color: #f8d7da;
}
.error-feedback {
  color: #dc3545;
  font-size: 0.875em;
}
</style>