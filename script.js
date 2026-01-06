async function run() {
  const url = document.getElementById("url").value;
  const concurrency = Number(document.getElementById("concurrency").value);
  const total = Number(document.getElementById("requests").value);
  const results = document.getElementById("results");

  if (!url || total < 1 || concurrency < 1) return;

  results.innerHTML = "";

  let completed = 0;
  let inFlight = 0;
  let success = 0;
  let failed = 0;

  async function fire() {
    inFlight++;
    const start = performance.now();
    try {
      const res = await fetch(url);
      const time = Math.round(performance.now() - start);
      success += res.ok ? 1 : 0;
      failed += res.ok ? 0 : 1;

      const li = document.createElement("li");
      li.innerText = `OK ${res.status} - ${time} ms`;
      results.appendChild(li);
    } catch {
      failed++;
      const li = document.createElement("li");
      li.innerText = "Request failed";
      results.appendChild(li);
    } finally {
      inFlight--;
      completed++;
      if (completed < total) schedule();
    }
  }

  function schedule() {
    while (inFlight < concurrency && completed + inFlight < total) {
      fire();
    }
  }

  schedule();
}
