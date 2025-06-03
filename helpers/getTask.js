export default async function getTask(apiClient, taskId) {
  if (!taskId) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.task({ id: taskId });
    return res.Task;
  } catch (e) {
    console.log("Not found task", taskId);
    throw e;
  }
}
