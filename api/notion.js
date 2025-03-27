export default async function handler(req, res) {
  const { title, content, database_id } = req.body;

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_SECRET}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parent: { database_id },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content
                }
              }
            ]
          }
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
