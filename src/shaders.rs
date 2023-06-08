use std::fs;
use std::time::SystemTime;

use glium::Program;
use nalgebra::{Vector2, Vector3};

#[cfg(debug_assertions)]
pub struct Shader {
    pub name: String,
    pub program: Program,
    pub url: String,
    pub time_changed_f: SystemTime,
    pub time_changed_v: SystemTime,
}

#[cfg(not(debug_assertions))]
pub struct Shader {
    pub name: String,
    pub program: Program,
}

#[derive(Clone, Copy)]
pub enum ShadvType {
    Bool(bool),
    Integer(i32),
    Float(f32),
    Vec2(Vector2<f32>),
    Vec3(Vector3<f32>),
}

pub struct ShaderVar {
    pub data: ShadvType,
}

impl Shader {
    pub fn craft(location: &str, display: &glium::Display) -> Shader {
        let vert_sause = fs::read_to_string(format!("{location}.vert")).unwrap();

        let frag_sause = fs::read_to_string(format!("{location}.frag")).unwrap();

        let prg = Program::from_source(display, &vert_sause, &frag_sause, None).unwrap();

        #[cfg(debug_assertions)]
        let sh = {
            let metadata_f = fs::metadata(format!("{location}.frag")).expect("failed to check shader file");
            let metadata_v = fs::metadata(format!("{location}.vert")).expect("failed to check shader file");

            Shader {
                name: "nya".into(),
                program: prg,
                url: location.to_owned(),
                time_changed_f: metadata_f.modified().unwrap(),
                time_changed_v: metadata_v.modified().unwrap(),
            }
        };

        #[cfg(not(debug_assertions))]
        let sh = Shader {
            name: "nya".into(),
            program: prg,
        };

        sh
    }
}