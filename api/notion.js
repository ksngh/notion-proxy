export default async function handler(req, res) {
    const {
        title,
        content,
        database_id,
        category,
        difficulty,
        status,
        studyDate,
        notes
    } = req.body;

    function parseContentToNotionBlocks(content) {
        const lines = content.split('\n');
        const blocks = [];
        let inCodeBlock = false;
        let codeLines = [];
        let codeLang = "plain text";

        for (const line of lines) {
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeLang = line.replace('```', '').trim() || 'plain text';
                } else {
                    inCodeBlock = false;
                    blocks.push({
                        object: "block",
                        type: "code",
                        code: {
                            language: codeLang,
                            rich_text: [
                                {
                                    type: "text",
                                    text: { content: codeLines.join('\n') }
                                }
                            ]
                        }
                    });
                    codeLines = [];
                }
            } else if (inCodeBlock) {
                codeLines.push(line);
            } else if (line.startsWith('### ')) {
                blocks.push({
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: line.replace('### ', '') }
                            }
                        ]
                    }
                });
            } else if (line.startsWith('## ')) {
                blocks.push({
                    object: "block",
                    type: "heading_2",
                    heading_2: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: line.replace('## ', '') }
                            }
                        ]
                    }
                });
            } else if (line.startsWith('# ')) {
                blocks.push({
                    object: "block",
                    type: "heading_1",
                    heading_1: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: line.replace('# ', '') }
                            }
                        ]
                    }
                });
            } else if (line.startsWith('- ')) {
                blocks.push({
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: line.replace('- ', '') }
                            }
                        ]
                    }
                });
            } else if (line.trim() === '') {
                continue; // ºó ÁÙ ¹«½Ã
            } else {
                blocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: line }
                            }
                        ]
                    }
                });
            }
        }

        return blocks;
    }

    const childrenBlocks = parseContentToNotionBlocks(content);

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
            children: childrenBlocks
        })
    });

    const data = await response.json();
    res.status(response.status).json(data);
}
