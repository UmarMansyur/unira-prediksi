const showLoader = () => {
    document.getElementById("layer")!.style.display = "flex";
}

const hideLoader = () => {
    document.getElementById("layer")!.style.display = "none";
}

export {
    showLoader,
    hideLoader
}