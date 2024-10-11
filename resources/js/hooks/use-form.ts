import {
    Errors,
    Method,
    Progress,
    router,
    VisitOptions,
} from "@inertiajs/core";
import { AxiosProgressEvent } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

type CancelToken = {
    cancel(): void;
};
type OptionsWithoutMethod = Omit<VisitOptions, "method">;

export interface InertiaFormProps {
    formKey: React.RefObject<string>;
    errors: Errors;
    getError(field: keyof Errors): string | undefined;
    hasErrors: boolean;
    processing: boolean;
    progress: Progress | null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    reset: () => void;
    clearErrors: (...fields: (keyof Errors)[]) => void;
    setError(field: keyof Errors, value: string): void;
    setError(errors: Record<keyof Errors, string>): void;
    submit: (form: HTMLFormElement, options?: OptionsWithoutMethod) => void;
    cancel: () => void;
}

export default function useForm(): InertiaFormProps {
    const isMounted = useRef<boolean>(false);
    const formKey = useRef<string>(
        `inertia-form:${Date.now()}:${Math.random()}`
    );
    const cancelToken = useRef<CancelToken | null>(null);
    const recentlySuccessfulTimeoutId = useRef<number | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [hasErrors, setHasErrors] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState<AxiosProgressEvent | null>(null);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const submit = useCallback(
        (form: HTMLFormElement, options: OptionsWithoutMethod = {}) => {
            const _options: OptionsWithoutMethod = {
                ...options,
                forceFormData: true,
                onCancelToken: (token) => {
                    cancelToken.current = token;

                    if (options.onCancelToken) {
                        return options.onCancelToken(token);
                    }
                },
                onBefore: (visit) => {
                    setWasSuccessful(false);
                    setRecentlySuccessful(false);
                    if (recentlySuccessfulTimeoutId.current) {
                        clearTimeout(recentlySuccessfulTimeoutId.current);
                    }

                    if (options.onBefore) {
                        return options.onBefore(visit);
                    }
                },
                onStart: (visit) => {
                    console.log("STARTING");
                    setProcessing(true);

                    if (options.onStart) {
                        return options.onStart(visit);
                    }
                },
                onProgress: (event) => {
                    if (event) {
                        setProgress(event);
                    }

                    if (options.onProgress) {
                        return options.onProgress(event);
                    }
                },
                onSuccess: (page) => {
                    console.log("SUCCESS");
                    if (isMounted.current) {
                        setProcessing(false);
                        setProgress(null);
                        setErrors({});
                        setHasErrors(false);
                        setWasSuccessful(true);
                        setRecentlySuccessful(true);
                        recentlySuccessfulTimeoutId.current = window.setTimeout(
                            () => {
                                if (isMounted.current) {
                                    setRecentlySuccessful(false);
                                }
                            },
                            2000
                        );
                    }

                    if (options.onSuccess) {
                        return options.onSuccess(page);
                    }
                },
                onError: (errors) => {
                    console.log("ERRORS", errors);
                    if (isMounted.current) {
                        setProcessing(false);
                        setProgress(null);
                        setErrors(errors);
                        setHasErrors(true);
                    }

                    if (options.onError) {
                        return options.onError(errors);
                    }
                },
                onCancel: () => {
                    if (isMounted.current) {
                        setProcessing(false);
                        setProgress(null);
                    }

                    if (options.onCancel) {
                        return options.onCancel();
                    }
                },
                onFinish: (visit) => {
                    if (isMounted.current) {
                        setProcessing(false);
                        setProgress(null);
                    }

                    cancelToken.current = null;

                    if (options.onFinish) {
                        return options.onFinish(visit);
                    }
                },
            };

            const data = new FormData(form);
            const method: Method = parseMethod(form.method);
            const url = form.action ?? route().current();

            console.log(
                "INFO FOR FORM: ",
                Object.fromEntries(data.entries()),
                method,
                url
            );

            if (method === "delete") {
                router.delete(url, { ..._options, data });
            } else {
                router[method](url, data, _options);
            }
        },
        [setErrors]
    );

    return {
        formKey,
        errors,
        getError(field: keyof Errors) {
            return errors?.[field];
        },
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        reset() {
            formKey.current = `inertia-form:${Date.now()}:${Math.random()}`;
        },
        setError(fieldOrFields: keyof Errors | Errors, maybeValue?: string) {
            setErrors((errors) => {
                const newErrors: Errors = { ...errors };
                if (typeof fieldOrFields === "string" && maybeValue) {
                    newErrors[fieldOrFields] = maybeValue;
                } else {
                    Object.assign(newErrors, fieldOrFields);
                }
                setHasErrors(Object.keys(newErrors).length > 0);
                return newErrors;
            });
        },
        clearErrors(...fields) {
            setErrors((errors) => {
                const newErrors = (
                    Object.keys(errors) as Array<keyof Errors>
                ).reduce(
                    (carry, field) => ({
                        ...carry,
                        ...(fields.length > 0 && !fields.includes(field)
                            ? { [field]: errors[field] }
                            : {}),
                    }),
                    {}
                );
                setHasErrors(Object.keys(newErrors).length > 0);
                return newErrors;
            });
        },
        submit,
        cancel() {
            if (cancelToken.current) {
                cancelToken.current.cancel();
            }
        },
    };
}

function parseMethod(maybeMethod: string): Method {
    switch (maybeMethod.toLowerCase()) {
        case "get":
            return "get";
        case "post":
            return "post";
        case "put":
            return "put";
        case "patch":
            return "patch";
        case "delete":
            return "delete";
        default:
            console.log(`Invalid method: ${maybeMethod}. Defaulting to 'get'.`);
            return "get";
    }
}
