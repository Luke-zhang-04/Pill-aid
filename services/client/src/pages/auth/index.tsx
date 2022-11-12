import "./index.scss"
import {
    Button,
    ButtonSet,
    Form,
    InlineNotification,
    Link,
    TextInput,
    Tile,
} from "carbon-components-react"
import {SubmitHandler, useForm} from "react-hook-form"
import {auth} from "~/firebase"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {useNavigate} from "react-router-dom"
import {zodResolver} from "@hookform/resolvers/zod"
import * as zod from "zod"
import React from "react"
import {createError} from "~/utils/error"

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(1, "Required field"),
})

type LoginSchema = typeof loginSchema["_type"]

const Login: React.FC = () => {
    const nav = useNavigate()
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    })
    const [error, setError] = React.useState<Error>()

    const onSubmit: SubmitHandler<LoginSchema> = async (event) => {
        try {
            setError(undefined)
            await signInWithEmailAndPassword(auth, event.email, event.password)
            nav("/")
        } catch (err) {
            setError(createError(err))
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <InlineNotification kind="error" title={error.name} subtitle={error.message} />
            )}
            <TextInput
                {...register("email", {required: true})}
                id="email"
                labelText="Email"
                invalid={Boolean(errors.email)}
                invalidText={errors.email?.message}
            />
            <TextInput
                {...register("password", {required: true})}
                id="password"
                labelText="Password"
                type="password"
                invalid={Boolean(errors.password)}
                invalidText={errors.password?.message}
            />
            <Link onClick={() => nav("/register", {replace: true})} className="change-mode-link">
                Create an Account
            </Link>
            <ButtonSet className="auth-footer">
                <Button kind="ghost">Log in with Google</Button>
                <Button type="submit">Log In</Button>
            </ButtonSet>
        </Form>
    )
}

const registerSchema = zod
    .object({
        username: zod.string().min(5, "Username must be at least 5 characters long"),
        email: zod.string().email(),
        password: zod.string().min(8, "Password must be at least 8 characters"),
        password2: zod.string().min(8, "Password must be at least 8 characters"),
    })
    .superRefine(({password, password2}, ctx) => {
        console.log({password, password2})
        if (password !== password2) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords did not match",
                path: ["password2"],
            })
        }
    })

type RegisterSchema = typeof registerSchema["_type"]

const Register: React.FC = () => {
    const nav = useNavigate()
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    })
    const [error, setError] = React.useState<Error>()

    const onSubmit: SubmitHandler<RegisterSchema> = async (event) => {
        try {
            setError(undefined)
            await createUserWithEmailAndPassword(auth, event.email, event.password)
            nav("/")
        } catch (err) {
            setError(createError(err))
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <InlineNotification kind="error" title={error.name} subtitle={error.message} />
            )}
            <TextInput
                {...register("username")}
                id="username"
                labelText="Username"
                invalid={Boolean(errors.username)}
                invalidText={errors.username?.message}
            />
            <TextInput
                {...register("email")}
                id="email"
                labelText="Email"
                type="email"
                invalid={Boolean(errors.email)}
                invalidText={errors.email?.message}
            />
            <TextInput
                {...register("password")}
                id="password"
                labelText="Password"
                type="password"
                invalid={Boolean(errors.password)}
                invalidText={errors.password?.message}
            />
            <TextInput
                {...register("password2")}
                id="password2"
                labelText="Confirm Password"
                type="password"
                invalid={Boolean(errors.password2)}
                invalidText={errors.password2?.message}
            />
            <Link onClick={() => nav("/login", {replace: true})} className="change-mode-link">
                Already have an account?
            </Link>
            <ButtonSet className="auth-footer">
                <Button kind="ghost">Register with Google</Button>
                <Button type="submit">Register</Button>
            </ButtonSet>
        </Form>
    )
}

export interface Props {
    mode: "login" | "register"
}

export const Auth: React.FC<Props> = ({mode}) => (
    <div className="auth-container">
        <Tile className="auth-form-container">
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
            {mode === "login" ? <Login /> : <Register />}
        </Tile>
    </div>
)

export default Auth
