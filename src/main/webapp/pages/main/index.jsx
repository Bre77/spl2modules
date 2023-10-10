import Button from "@splunk/react-ui/Button";
import ControlGroup from "@splunk/react-ui/ControlGroup";
import JSONTree from "@splunk/react-ui/JSONTree";
import Link from "@splunk/react-ui/Link";
import Message from "@splunk/react-ui/Message";
import P from "@splunk/react-ui/Paragraph";
import Select from "@splunk/react-ui/Select";
import Table from "@splunk/react-ui/Table";
import Text from "@splunk/react-ui/Text";
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

const MutateButton = ({ mutation, label, disabled = false }) => (
    <Button
        appearance={{ idle: "default", loading: "pill", success: "primary", error: "destructive" }[mutation.status]}
        onClick={mutation.mutate}
        disabled={mutation.isLoading || disabled}
        label={{ idle: label, loading: "Running", success: "Success", error: "Failed" }[mutation.status]}
    />
);

const Main = () => {
    const [app, setApp] = useState("search");
    const [name, setName] = useState("_default");

    const apps = useQuery({
        queryKey: ["apps"],
        queryFn: () =>
            fetch(`${splunkdPath}/services/apps/local?output_mode=json`, defaultFetchInit).then((res) =>
                res.ok ? res.json().then((data) => data.entry.map((entry) => entry.name)) : Promise.reject(res.statusCode)
            ),
        placeholderData: [],
    });

    const module = useQuery({
        queryKey: ["apikeys"],
        queryFn: () =>
            fetch(`${splunkdPath}/services/spl2/modules/apps.${app}.${name}`, defaultFetchInit).then((res) =>
                res.ok ? res.json() : Promise.reject(res.statusCode)
            ),
    });
    return (
        <>
            <P>Test</P>
            <Select>
                {apps.data.map((app) => (
                    <Select.Option key={app} value={app}>
                        {app}
                    </Select.Option>
                ))}
            </Select>
            <Text value={name} onChange={setName} placeholderData="_default" />
            <JSONTree json={module.data} expandChildren />;
        </>
    );
};

Page(<Main />);
