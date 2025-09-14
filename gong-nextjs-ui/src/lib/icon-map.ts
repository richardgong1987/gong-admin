// lib/icon-map.ts
import {
    Circle,
    User,
    Gauge,
    Settings2,
    Box,
    Cpu,
    FileStack,
    Folder,
    Cloud,
    Info,
    Image as Picture,
    ShoppingCart,
    BookOpen,
    Sparkles,
    Server,
    Wand2,
    PieChart,
    MessageSquare,
    Puzzle,
    FileText,
    Compass,
    Upload,
    Link as LinkIcon,
    type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
    // your meta.icon → lucide
    odometer: Gauge,
    user: User,
    management: FileStack,
    tools: Settings2,
    cpu: Cpu,
    files: FileStack,
    folder: Folder,
    cloudy: Cloud,
    "info-filled": Info,
    picture: Picture,
    "picture-filled": Picture,
    shop: ShoppingCart,
    notebook: BookOpen,
    "magic-stick": Wand2,
    server: Server,
    "pie-chart": PieChart,
    message: MessageSquare,
    platform: Puzzle,
    operation: Settings2,
    reading: FileText,
    compass: Compass,
    upload: Upload,
    "upload-filled": Upload,
    "scaleToOriginal": Picture,
    "customer-gva": Sparkles,
    box: Box,
    cherry: Sparkles,
    avatar: User,
};

export function getIcon(name?: string): LucideIcon {
    if (!name) return Circle;
    return map[name] || Circle;
}
