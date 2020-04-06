import fetch from 'node-fetch'

export async function fetchMe(request: string): Promise<string> {
  const response = await fetch(request)
  if (
    response.status == 200 &&
    response.headers.get('content-type').indexOf('text/html') > -1
  ) {
    const body = await response.text()
    return body
  }
  // Don't return any content if response didn't contain any HTML content
  return ''
}
