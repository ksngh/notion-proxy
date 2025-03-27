export default async function handler(req, res) {
    const {
        title,
        content,
        database_id,
        category,
        difficulty,
        status,
        studyDate,  // ISO8601 형식 날짜 문자열 (선택)
        notes       // 부가 설명 (string)
    } = req.body;

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
                Title: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                Category: {
                    select: {
                        name: category
                    }
                },
                Difficulty: {
                    select: {
                        name: difficulty
                    }
                },
                Status: {
                    status: {
                        name: status
                    }
                },
                "Study Date": studyDate
                    ? {
                        date: {
                            start: studyDate
                        }
                    }
                    : { date: null },
                Notes: {
                    rich_text: [
                        {
                            text: {
                                content: notes || ""
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
    res.status(response.status).json(data);
}
