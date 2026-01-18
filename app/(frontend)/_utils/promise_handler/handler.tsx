import ErrorPage from "./error/error";
import LoadingPage from "./loading/loading";


interface PromiseHandlerProps {
    isLoading?: boolean;
    isError?: boolean;
    message?: string;
    width?: string;
    height?: string;
}

export default function PromiseHandler({ isLoading, isError, message, width, height }: PromiseHandlerProps) {
    if (isLoading) {
        return <LoadingPage height={height} width={width} />;
    }
    if (isError) {
        return <ErrorPage height={height} width={width} message={message} />;
    }
    return null;
}