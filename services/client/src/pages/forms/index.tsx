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
    Dropdown,
    TextInputSkeleton,
    DropdownSkeleton,
    DatePickerSkeleton,
    ButtonSkeleton,
} from "carbon-components-react"
import {useNavigate, useParams} from "react-router-dom"
import {SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as zod from "zod"
import React, {useContext, useEffect} from "react"
import {createError} from "~/utils/error"
import {db, toDatabase} from "~/firebase"
import {AuthContext} from "~/contexts"
import {doc, getDoc} from "firebase/firestore"
import {Data} from "~/types/data"
import {fillZeros} from "~/utils/date"

const formSchema = zod.object({
    name: zod.string().min(1, "Required field"),
    tod: zod
        .string()
        .min(1, "Required Field")
        .regex(/^[0-9]{1,2}:[0-9]{1,2}$/u),
    isAm: zod.boolean().default(true),
    medType: zod.string().min(1, "Required field"),
    dosage: zod
        .union([zod.string(), zod.number()])
        .transform(Number)
        .refine((num) => num >= 0),
})

type FormSchema = typeof formSchema["_type"]

export const Forms: React.FC = () => {
    const nav = useNavigate()
    const {id} = useParams<{id?: string}>()
    const {currentUser} = useContext(AuthContext)
    const [isWaiting, setIsWaiting] = React.useState(Boolean(id))
    const {
        register,
        handleSubmit,
        formState: {errors},
        ...form
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    })
    const [error, setError] = React.useState<Error>()

    const drugTypes = ["Vitamin B", "Advil"]

    useEffect(() => {
        ;(async () => {
            if (currentUser && id) {
                const data = (await getDoc(doc(db, currentUser.uid, id))).data() as
                    | Data
                    | undefined

                if (data) {
                    const isAm = data.hour < 12
                    const hour = data.hour > 12 ? data.hour - 12 : data.hour || 12

                    form.setValue("name", data.name)
                    form.setValue("tod", `${hour}:${fillZeros(data.min)}`)
                    form.setValue("isAm", isAm)
                    form.setValue("medType", data.medType)
                    form.setValue("dosage", data.dosage)
                }

                setIsWaiting(false)
            }
        })()
    }, [currentUser, id])

    const onSubmit: SubmitHandler<FormSchema> = async (values) => {
        try {
            setError(undefined)

            if (currentUser) {
                const time = values.tod.split(":") as [hour: string, min: string]

                await toDatabase(`${currentUser.uid}/${id ?? crypto.randomUUID()}`, {
                    hour: values.isAm ? Number(time[0]) : (Number(time[0]) % 12) + 12,
                    min: Number(time[1]),
                    medType: values.medType,
                    name: values.name,
                    dosage: values.dosage,
                })
            }
            nav("/drugview")
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
                    {isWaiting ? (
                        <TextInputSkeleton />
                    ) : (
                        <TextInput
                            {...register("name")}
                            id="name"
                            labelText="Name"
                            invalid={Boolean(errors.name)}
                            invalidText={errors.name?.message}
                        />
                    )}
                    {isWaiting ? (
                        <DatePickerSkeleton />
                    ) : (
                        <TimePicker
                            // Manually deal with time
                            onChange={(event) => form.setValue("tod", event.target.value)}
                            value={form.getValues().tod}
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
                                value={form.getValues().isAm ? "am" : "pm"}
                            >
                                <SelectItem value="am" text="AM" />
                                <SelectItem value="pm" text="PM" />
                            </TimePickerSelect>
                        </TimePicker>
                    )}
                    {isWaiting ? (
                        <TextInputSkeleton />
                    ) : (
                        <TextInput
                            {...register("dosage")}
                            id="dosage"
                            labelText="Dosage"
                            type="number"
                            invalid={Boolean(errors.dosage)}
                            invalidText={errors.dosage?.message}
                        />
                    )}
                    {isWaiting ? (
                        <DropdownSkeleton />
                    ) : (
                        <Dropdown
                            {...register("medType")}
                            onChange={(yourmom) =>
                                form.setValue("medType", yourmom.selectedItem ?? "")
                            }
                            ariaLabel="Dropdown"
                            id="drug-type"
                            items={drugTypes}
                            initialSelectedItem={form.getValues().medType}
                            label="Choose Medicine Type"
                            titleText="Medicine Type"
                            invalid={Boolean(errors.medType)}
                            invalidText={errors.medType?.message}
                        />
                    )}
                    <ButtonSet className="content-footer">
                        <div />
                        {isWaiting ? <ButtonSkeleton /> : <Button type="submit">Submit</Button>}
                    </ButtonSet>
                </Tile>
            </div>
        </Form>
    )
}

export default Forms
