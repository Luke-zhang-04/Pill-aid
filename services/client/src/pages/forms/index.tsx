import "~/index.scss"
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

const formSchema = zod.object({
    name: zod.string().min(1, "Required field"),
    tod: zod
        .string()
        .min(1, "Required Field")
        .regex(/^[0-9]{1,2}:[0-9]{1,2}$/u),
    isAm: zod.boolean().default(true),
    medType: zod.string().min(1, "Required field"),
})

type FormSchema = typeof formSchema["_type"]

export const Forms: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        ...form
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    })
    const [error, setError] = React.useState<Error>()

    const onSubmit: SubmitHandler<FormSchema> = (values) => {
        try {
            setError(undefined)
            console.log(values)
        } catch (err) {
            setError(createError(err))
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <InlineNotification kind="error" title={error.name} subtitle={error.message} />
            )}
            <div className="container">
                <Tile className="content-container">
                    <h2>Edit Dispensing Schedule</h2>
                    <TextInput
                        {...register("name")}
                        id="name"
                        labelText="Name"
                        invalid={Boolean(errors.name)}
                        invalidText={errors.name?.message}
                    />

                    <TimePicker
                        // Manually deal with time
                        onChange={(event) => form.setValue("tod", event.target.value)}
                        onBlur={() => form.setFocus("tod")}
                        name="tod"
                        invalid={Boolean(errors.tod)}
                        invalidText={errors.tod?.message}
                        id="tod"
                        labelText="Drug Dispensing Time"
                        placeholder="hh:mm"
                    >
                        <TimePickerSelect
                            labelText=""
                            id="tod"
                            onChange={(event) =>
                                form.setValue("isAm", event.target.value === "am")
                            }
                        >
                            <SelectItem value="am" text="AM" />
                            <SelectItem value="pm" text="PM" />
                        </TimePickerSelect>
                    </TimePicker>

                    <TextInput
                        {...register("medType")}
                        id="medType"
                        labelText="Medicine Type"
                        type="medType"
                        invalid={Boolean(errors.medType)}
                        invalidText={errors.medType?.message}
                    />

                    <ButtonSet className="content-footer">
                        <div />
                        <Button type="submit">Submit</Button>
                    </ButtonSet>
                </Tile>
            </div>
        </Form>
    )
}

export default Forms