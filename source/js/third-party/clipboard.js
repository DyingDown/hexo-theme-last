var copyCode = new ClipboardJS('.code-copy-button', {
    text: function(trigger) {
        var index = parseInt(trigger.dataset.index);
        console.log("codeblock-" + index.toString())
        var code = document.getElementById("codeblock-" + index.toString());
        return code.innerText;
    }
})

copyCode.on("success", function(e) {
    message.show({
        type: "success",
        text: i18n.copy.success,
        isClose: false
    })
})

copyCode.on("error", function(e) {
    message.show({
        type: "error",
        text: i18n.copy.error,
        isClose: false
    })
})