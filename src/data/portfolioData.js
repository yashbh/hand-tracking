export const portfolioData = {
    nodes: [
        { id: 'root', label: 'Yash Bhati', color: '#ff00ff', size: 1.5, position: [0, 0, 0], info: "Creative Developer & Tech Enthusiast" },
        // Level 1
        {
            id: 'skills', label: 'Skills', color: '#00ffff', size: 1.0, position: [-3, 2, 0], info: "Click to see Skills",
            children: [
                { id: 'react', label: 'React', color: '#00ccff', info: "Hooks, Context, Fiber" },
                { id: 'three', label: 'Three.js', color: '#ffffff', info: "Shaders, Canvas, R3F" },
                { id: 'python', label: 'Python', color: '#306998', info: "FastAPI, scripting" },
                { id: 'ai', label: 'AI/ML', color: '#ffcc00', info: "LLMs, Agents, RAG" },
                { id: 'node', label: 'Node.js', color: '#68a063', info: "Express, Backend" }
            ]
        },
        {
            id: 'projects', label: 'Projects', color: '#ffff00', size: 1.0, position: [3, 2, 0], info: "Click to see Projects",
            children: [
                { id: 'hand', label: 'Hand Tracking', color: '#ffffaa', info: "Computer Vision Web App" },
                { id: 'antigravity', label: 'Antigravity', color: '#ff00ff', info: "Agentic Coding AI" },
                { id: 'portfolio', label: 'Portfolio', color: '#00ffff', info: "3D Neural Interface" }
            ]
        },
        { id: 'contact', label: 'Contact', color: '#ff3300', size: 1.0, position: [0, -3, 0], info: "yashbhati@example.com" },
    ],
    links: [
        { source: 'root', target: 'skills' },
        { source: 'root', target: 'projects' },
        { source: 'root', target: 'contact' },
    ]
};
