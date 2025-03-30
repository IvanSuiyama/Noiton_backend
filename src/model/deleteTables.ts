import connection from "../config/database";// Adjust the path if necessary

export async function deleteAllTables() {
    try {
        // Deleting the workspace table first
        await connection.query('DROP TABLE IF EXISTS workspace CASCADE;');
        console.log('Workspace table deleted.');

        // Deleting the usuario table next
        await connection.query('DROP TABLE IF EXISTS usuario CASCADE;');
        console.log('Usuario table deleted.');

        console.log('All tables deleted successfully.');
    } catch (error) {
        console.error('Error deleting tables:', error);
    }
}
