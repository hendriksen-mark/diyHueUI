import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import { GenericText, GenericTextArea } from "../components/GenericText/GenericText";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import TextButton from "../components/TextButton/TextButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import GenericButton from "../components/GenericButton/GenericButton";
import { toast } from "react-hot-toast";

const Debug = ({ HOST_IP, API_KEY }) => {
    const [url, setUrl] = useState("/groups");
    const [urlPrefix, setUrlPrefix] = useState(`/api/${API_KEY}`);
    const [h1name, setH1Name] = useState("");
    const [h1value, setH1Value] = useState("");
    const [h2name, setH2Name] = useState("");
    const [h2value, setH2Value] = useState("");
    const [body, setBody] = useState("");
    const [response, setResponse] = useState("");
    const [useV2Api, setUseV2Api] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [streamOutput, setStreamOutput] = useState("");
    const [streamAbortController, setStreamAbortController] = useState(null);
    const streamOutputRef = useRef(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        confirmAlert({
            title: "Warning",
            message: "This page contains advanced and potentially dangerous options. Proceed only if you know what you are doing.",
            buttons: [
                {
                    label: "Proceed",
                    onClick: () => setConfirmed(true),
                },
                {
                    label: "Cancel",
                    onClick: () => setConfirmed(false),
                },
            ],
            closeOnEscape: false,
            closeOnClickOutside: false,
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (streamOutputRef.current) {
            streamOutputRef.current.scrollTop = streamOutputRef.current.scrollHeight;
        }
    }, [streamOutput]);

    const handleRequest = (method) => {
        const headers = {};
        if (h1name && h1value) headers[h1name] = h1value;
        if (h2name && h2value) headers[h2name] = h2value;
        axios({
            method,
            url: `${HOST_IP}${urlPrefix}${url}`,
            headers,
            data: body ? body : undefined,
        })
            .then((result) => {
                setResponse(
                    typeof result.data === "object"
                        ? JSON.stringify(result.data, null, 2)
                        : result.data
                );
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setResponse(
                        typeof error.response.data === "object"
                            ? JSON.stringify(error.response.data, null, 2)
                            : "Error: " + error.response.data
                    );
                } else {
                    setResponse("Error: " + error.message);
                }
            });
    };

    const handleV2Api = (value) => {
        setUseV2Api(value);
        if (value) {
            setUrl("/room");
            setUrlPrefix("/clip/v2/resource");
            setH1Name("hue-application-key");
            setH1Value(API_KEY);
        } else {
            setUrl("/groups");
            setUrlPrefix(`/api/${API_KEY}`);
            setH1Name("");
            setH1Value("");
        }
    };

    const handleStartStream = async () => {
        if (streaming) {
            if (streamAbortController) streamAbortController.abort();
            setStreaming(false);
            setStreamAbortController(null);
            return;
        }
        setStreamOutput("");
        setStreaming(true);
        const controller = new AbortController();
        setStreamAbortController(controller);

        try {
            const response = await fetch(
                `${HOST_IP}/eventstream/clip/v2`,
                {
                    method: "GET",
                    headers: {
                        "hue-application-key": API_KEY,
                        "Accept": "text/event-stream"
                    },
                    signal: controller.signal,
                }
            );
            if (!response.body) {
                setStreamOutput("No stream body available.");
                setStreaming(false);
                setStreamAbortController(null);
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            let active = true;
            controller.signal.addEventListener("abort", () => { active = false; });
            while (active) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                let lines = buffer.split('\n');
                // Keep the last partial line in buffer
                buffer = lines.pop();
                for (const line of lines) {
                    if (line.trim() !== "") {
                        setStreamOutput(prev => prev + line + '\n');
                    }
                }
                // Yield to event loop to allow UI updates and state changes
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            // Flush any remaining buffer
            if (buffer && buffer.trim() !== "") {
                setStreamOutput(prev => prev + buffer + '\n');
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setStreamOutput("Stream error: " + err.message);
            }
        }
        setStreaming(false);
        setStreamAbortController(null);
    };

    const onTestClick = () => {
        axios
            .get(`${HOST_IP}/api/${API_KEY}/aiohue_test`)
            .then((result) => {
                if (result.data && result.data.message === "aiohue test successful") {
                    toast.success("Test successful");
                    console.log(`AIOHue test successful, found ${result.data.devices.length} devices.`);
                } else {
                    toast.error("Test failed, check log for details");
                    console.error("AIOHue test failed:", result.data);
                }
            })
            .catch((error) => {
                toast.error("Test failed, check log for details");
                console.error("AIOHue test error:", error);
            });
    };

    if (!confirmed) {
        return null;
    }

    return (
        <div className="inner">
            <CardGrid options="main">
                <GlassContainer options="spacer">
                    <PageContent>
                        <div>
                            <div className="headline">AIOHue tester</div>
                            <p>
                                Use this if you find problems with 3rd party integrations.
                            </p>
                            <div className="form-control">
                                <GenericButton
                                    value="Test"
                                    color="blue"
                                    size=""
                                    type="submit"
                                    onClick={onTestClick}
                                />
                            </div>
                        </div>
                    </PageContent>
                </GlassContainer>
                <GlassContainer options="spacer">
                    <PageContent>
                        <div>
                            <div className="headline">CLIP API Debugger</div>
                            <div className="form-control">
                                <FlipSwitch
                                    id="V2"
                                    value={useV2Api}
                                    onChange={(e) => handleV2Api(e)}
                                    checked={useV2Api}
                                    label="Use V2 API"
                                    position="right"
                                />
                            </div>
                            <label>URL</label>
                            <div className="form-control">
                                <GenericText
                                    label={`Command Url (${urlPrefix})`}
                                    type="text"
                                    placeholder="Command Url"
                                    value={url}
                                    onChange={(e) => setUrl(e)}
                                />
                            </div>
                            <TextButton label="GET" color="blue" onClick={() => handleRequest("GET")} />
                            <TextButton label="PUT" color="purple" onClick={() => handleRequest("PUT")} />
                            <TextButton label="POST" color="green" onClick={() => handleRequest("POST")} />
                            <TextButton label="DELETE" color="red" onClick={() => handleRequest("DELETE")} />
                            <label>Headers:</label>
                            <div className="form-control">
                                <GenericText
                                    label="Header 1 Name"
                                    type="text"
                                    placeholder="h1name"
                                    value={h1name}
                                    onChange={(e) => setH1Name(e)}
                                />
                            </div>
                            <div className="form-control">
                                <GenericText
                                    label="Header 1 Value"
                                    type="text"
                                    placeholder="h1value"
                                    value={h1value}
                                    onChange={(e) => setH1Value(e)}
                                />
                            </div>
                            <div className="form-control">
                                <GenericText
                                    label="Header 2 Name"
                                    type="text"
                                    placeholder="h2name"
                                    value={h2name}
                                    onChange={(e) => setH2Name(e)}
                                />
                            </div>
                            <div className="form-control">
                                <GenericText
                                    label="Header 2 Value"
                                    type="text"
                                    placeholder="h2value"
                                    value={h2value}
                                    onChange={(e) => setH2Value(e)}
                                />
                            </div>
                            <div className="form-control">
                                <GenericTextArea
                                    label="Message Body"
                                    value={body}
                                    onChange={(e) => setBody(e)}
                                    rows={10}
                                    cols={100}
                                />
                            </div>
                            <div className="form-control">
                                <GenericTextArea
                                    label="Command Response"
                                    value={response}
                                    readOnly={true}
                                    rows={25}
                                    cols={100}
                                />
                            </div>
                        </div>
                    </PageContent>
                </GlassContainer>

                <GlassContainer options="spacer">
                    <PageContent>
                        <div>
                            <div className="headline">Event Stream</div>
                            <div className="form-control">
                                <FlipSwitch
                                    id="Stream"
                                    value={streaming}
                                    onChange={(e) => handleStartStream(e)}
                                    checked={streaming}
                                    label="Follow Event Stream"
                                    position="right"
                                />
                            </div>
                            <div className="form-control">
                                <GenericTextArea
                                    label="Event Stream Output"
                                    value={streamOutput}
                                    readOnly={true}
                                    rows={25}
                                    cols={100}
                                    inputRef={streamOutputRef}
                                />
                            </div>
                        </div>
                    </PageContent>
                </GlassContainer>
            </CardGrid>
        </div>
    );
}

export default Debug;
