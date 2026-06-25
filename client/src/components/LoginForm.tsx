import { useState } from 'react'
import { useForm , type SubmitHandler, type SubmitErrorHandler } from "react-hook-form"
import { useAuth } from '../contexts/AuthContext'

interface LoginInputs {
    email: string
    password: string
    name?: string
    passwordConfirm?: string
}


export default function LoginForm() {
    const [mode, setMode] = useState<"login" | "register">("login")
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<LoginInputs>({ mode: "onBlur" })

    const { login: loginUser, register: registerUser } = useAuth()
    
    const isValid: SubmitHandler<LoginInputs> = async (data) => {
        if (mode === "login") {
            await loginUser(data.email, data.password)
        } else {
            await registerUser(data.email, data.name!, data.password)
        }
        setValue("password", "")
        setValue("passwordConfirm", "")
    }
    const isInValid: SubmitErrorHandler<LoginInputs> = (errors) => {
        console.log(errors)
        if (mode === "login") {
            console.log("Fail Login")
        } else {
            console.log("Fail Register")
        }
        
    }

    return (
        <div>
            <div className="flex-col">
                <div>
                    <button type="button" onClick={() => {
                        setMode("login")
                        reset()
                    }}>Login</button>
                    <button type="button" onClick={() => {
                        setMode("register")
                        reset()
                    }}>Register</button>
                </div>
                <form onSubmit={handleSubmit(isValid, isInValid)}>
                    <div>
                        <label className="text-sm" htmlFor="email">
                        Email
                        </label>
                    </div>
                    <div>
                        <input
                        {...register("email", { required: "emailを入力してください" })}
                        className="rounded-md border px-3 py-2 focus:border-2 focus:border-teal-500 focus:outline-none"
                        type="email"
                        />
                    </div>
                    {errors.email?.message && <div className="text-red-500">
                        {errors.email.message}
                    </div>}
                    
                    {mode === "register" && (
                        <div>
                            <div>
                                <label className="text-sm" htmlFor="name">
                                Name
                                </label>
                            </div>
                        
                            <div>
                                <input
                                {...register("name", {
                                    required: "nameを入力してください",
                                })}
                                className="rounded-md border px-3 py-2 focus:border-2 focus:border-teal-500 focus:outline-none"
                            />
                            </div>
                        </div>
                    )} 

                    <div>
                        <label className="text-sm" htmlFor="password">
                        Password
                        </label>
                    </div>

                    <div>
                    <input
                        {...register("password", {
                            required: "passwordを入力してください",
                            minLength: { value: 8, message: "8文字以上入力してください" },
                        })}
                        className="rounded-md border px-3 py-2 focus:border-2 focus:border-teal-500 focus:outline-none"
                        type="password"
                        />
                    </div>
                    {errors.password?.message && <div className="text-red-500">
                        {errors.password.message}
                    </div>}

                    {mode === "register" && (
                        <div>
                            <div>
                                <label className="text-sm" htmlFor="passwordkConfirm">
                                Confirm Password
                                </label>
                            </div>
                            <div>
                            <input
                            {...register("passwordConfirm", {
                                required: "確認用パスワード入力してください",
                                validate: (value, formValues) => 
                                    value === formValues.password || "パスワードが一致しません",
                            })}
                            className="rounded-md border px-3 py-2 focus:border-2 focus:border-teal-500 focus:outline-none"
                            type="password"
                            />
                            </div>
                            {errors.passwordConfirm?.message && <div className="text-red-500">
                                {errors.passwordConfirm.message}
                            </div>}
                        </div>
                    )}

                    <div>
                        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
    
}