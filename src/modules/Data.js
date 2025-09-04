export const getData = async () => {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error(`response error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('error fetching data', err)
    }
}