#[cfg(mobile)]
pub mod mobile;
#[cfg(mobile)]
pub use mobile::*;

pub fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
