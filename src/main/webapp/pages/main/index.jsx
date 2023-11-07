import FloppyDisk from "@splunk/react-icons/FloppyDisk";
import Button from "@splunk/react-ui/Button";
import ControlGroup from "@splunk/react-ui/ControlGroup";
import JSONTree from "@splunk/react-ui/JSONTree";
import Link from "@splunk/react-ui/Link";
import Message from "@splunk/react-ui/Message";
import P from "@splunk/react-ui/Paragraph";
import Select from "@splunk/react-ui/Select";
import Text from "@splunk/react-ui/Text";
import TextArea from "@splunk/react-ui/TextArea";
import { splunkdPath } from "@splunk/splunk-utils/config";
import { defaultFetchInit } from "@splunk/splunk-utils/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Page from "../../shared/page";

const makeBody = (data) => {
    return Object.entries(data).reduce((form, [key, value]) => {
        form.append(key, value);
        return form;
    }, new URLSearchParams());
};

const MutateButton = ({ mutation, icon, label, disabled = false }) => (
    <Button
        icon={icon}
        appearance={{ idle: "default", loading: "pill", success: "primary", error: "destructive" }[mutation.status]}
        onClick={mutation.mutate}
        disabled={mutation.isLoading || disabled}
        label={{ idle: label, loading: "Running", success: "Success", error: "Failed" }[mutation.status]}
    />
);

const Main = () => {
    const [app, setApp] = useState("search");
    const handleApp = (e, { value }) => setApp(value);
    const [name, setName] = useState("_default");
    const handleName = (e, { value }) => setName(value);
    const [content, setContent] = useState("");
    const handleContent = (e, { value }) => setContent(value);

    const apps = useQuery({
        queryKey: ["apps"],
        queryFn: () =>
            fetch(`${splunkdPath}/services/apps/local?output_mode=json`, defaultFetchInit).then((res) =>
                res.ok ? res.json().then((data) => data.entry.map((entry) => entry.name)) : Promise.reject(res.statusCode)
            ),
        placeholderData: [],
    });

    const module = useQuery({
        queryKey: ["module", app, name],
        queryFn: () =>
            fetch(`${splunkdPath}/services/spl2/modules/apps.${app}.${name}`, defaultFetchInit).then((res) =>
                res.ok ? res.json().then((data) => data?.definition) : Promise.reject()
            ),
    });

    const save = useMutation({
        mutationFn: () => {
            return fetch(`${splunkdPath}/services/spl2/modules/apps.${app}.${name}`, {
                ...defaultFetchInit,
                method: "POST",
                body: makeBody({ definition: module.data.definition }),
            }).then((res) => (res.ok ? res.json() : Promise.reject(res.statusCode)));
        },
    });

    console.log(module.data);
    return (
        <>
            <P>Look at SPL2 Modules</P>
            <ControlGroup label="App">
                <Select value={app} onChange={handleApp}>
                    {apps.data.map((a) => (
                        <Select.Option key={a} label={a} value={a} />
                    ))}
                </Select>
            </ControlGroup>
            <ControlGroup label="Module">
                <Text value={name} onChange={handleName} placeholderData="_default" error={module.isError} />
            </ControlGroup>
            <TextArea value={module.data || ""} rowsMin={20} disabled={module.isError} />
            <MutateButton icon={<FloppyDisk variant="filled" />} label="Save" mutation={save} />
        </>
    );
};

Page(<Main />);
