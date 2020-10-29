export const loadScript = (
  url: string,
  callback?: (query?: string) => void
) => {
  const script: any = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        if (callback) {
          callback();
        }
      }
    };
  } else {
    if (callback) {
      script.onload = () => callback();
    }
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};
