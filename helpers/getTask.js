export default async function getTask(apiClient, taskId) {
  if (!taskId) return null;
  try {
    const res = await apiClient.queryTask(taskId);
    if (res.status === 200) {
      let u = res.data.Task;
      return u;
    }
  } catch (e) {
    console.log("Not found task", taskId);
  }
}
