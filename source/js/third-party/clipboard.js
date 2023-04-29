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
        text: "复制成功！",
        isClose: false
    })
})

copyCode.on("error", function(e) {
    message.show({
        type: "error",
        text: "复制失败，请重新尝试！",
        isClose: false
    })
})