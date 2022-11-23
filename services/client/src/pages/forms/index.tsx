import "./index.scss"
import {
    Button,
    ButtonSet,
    Form,
    InlineNotification,
    SelectItem,
    TextInput,
    TimePicker,
    TimePickerSelect,
    Tile,
} from "carbon-components-react"
import {SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as zod from "zod"
import React from "react"
import {createError} from "~/utils/error"
import {useNavigate} from "react-router"

const loginSchema = zod.object({
    name: zod.string().min(1, "Required field"),
    tod: zod.string().min(1, "Required field"),
    medType: zod.string().min(1, "Required field"),
})

type LoginSchema = typeof loginSchema["_type"]

export const Forms: React.FC = () => {
    const nav = useNavigate()
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    })
    const [error, setError] = React.useState<Error>()

    const onSubmit: SubmitHandler<LoginSchema> = async (values) => {
        try {
            setError(undefined)
            await console.log(values)
            // await signInWithEmailAndPassword(auth, values.name, values.tod, values.medType)
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
            <div className="auth-container">
                <Tile className="auth-form-container">
                    <TextInput
                        {...register("name", {required: true})}
                        id="name"
                        labelText="Name"
                        invalid={Boolean(errors.name)}
                        invalidText={errors.name?.message}
                    />

                    <TimePicker
                        {...register("tod", {required: true})}
                        invalid={Boolean(errors.medType)}
                        invalidText={errors.medType?.message}
                        id="tod"
                        labelText="Drug Dispensing Time"
                        placeholder="hh:mm"
                    >
                        <TimePickerSelect labelText="" id="tod">
                            <SelectItem value="am" text="AM" />
                            <SelectItem value="pm" text="PM" />
                        </TimePickerSelect>
                    </TimePicker>

                    <TextInput
                        {...register("medType", {required: true})}
                        id="medType"
                        labelText="Drug Flavor"
                        type="medType"
                        invalid={Boolean(errors.medType)}
                        invalidText={errors.medType?.message}
                    />

                    <ButtonSet className="auth-footer">
                        <Button type="submit">Submit</Button>
                    </ButtonSet>
                </Tile>
            </div>
        </Form>
    )
}

export default Forms
