export default function dynamicId(url: string) {
    return url.split('/').pop()?.split('?')[0];
}