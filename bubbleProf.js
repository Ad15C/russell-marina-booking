async function bubbleProf(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        if (i % 1000 === 0) console.log(`Iteration principale ${i}/${n}`);
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
        /* laisse Node respirer entre chaque itération */
        await new Promise(resolve => setImmediate(resolve));
    }
    console.log("Test BubbleProf terminé !");
    return arr;
}

module.exports = bubbleProf;
