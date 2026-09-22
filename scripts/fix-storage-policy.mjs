import 'dotenv/config';
import postgres from 'postgres';

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("No DATABASE_URL found");
        process.exit(1);
    }

    const sql = postgres(connectionString);

    try {
        console.log("Đang sửa lại quyền cho Supabase Storage...");
        
        // Cấp quyền INSERT cho tất cả mọi người
        await sql`
            CREATE POLICY "Allow all public uploads" 
            ON storage.objects FOR INSERT TO public 
            WITH CHECK ( bucket_id = 'uploads' );
        `;
        
        console.log("✅ Đã cấp quyền Upload thành công!");
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log("✅ Quyền Upload đã tồn tại.");
        } else {
            console.error("❌ Lỗi:", error);
        }
    } finally {
        await sql.end();
    }
}

main();
