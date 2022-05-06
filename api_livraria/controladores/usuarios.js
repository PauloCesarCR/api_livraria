const conexao = require('../conexao');

const listarUsuarios = async (req, res) => {
    try {
        const { rows: usuarios } = await conexao.query('select * from usuarios');

        for (const usuario of usuarios) {
            const {rows : emprestimos} = await conexao.query('select * from emprestimos where id_usuario= $1',[usuario.id])
            
            const listarUsuarios = []
            for (const emprestimo of emprestimos) {
                console.log(emprestimo)
                const livro = await conexao.query(`select * from livros where id=$1`,[emprestimo.id_livro]);   
                const livroAtual = livro.rows[0]
                console.log(livroAtual)
                listarUsuarios.push({...emprestimo,livro:livroAtual.nome})    

            }
         
              
        
            usuario.emprestimos = listarUsuarios;                 
        }

        return res.status(200).json(usuarios)
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const filtrarUsuario = async (req,res)=> {
    const {id} = req.params

    try {
        const { rows: usuarios } = await conexao.query('select * from usuarios where id=$1',[id]);

        for (const usuario of usuarios) {
            const {rows : emprestimos} = await conexao.query('select * from emprestimos where id_usuario= $1',[id])
            
            const listarUsuario = []
            for (const emprestimo of emprestimos) {
                console.log(emprestimo)
                const livro = await conexao.query(`select * from livros where id=$1`,[emprestimo.id_livro]);   
                const livroAtual = livro.rows[0]
                console.log(livroAtual)
                listarUsuario.push({...emprestimo,livro:livroAtual.nome})    

            }
        
            usuario.emprestimos = listarUsuario;                 
        }

        return res.status(200).json(usuarios)
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarUsuario = async (req,res)=> {
    const { nome, idade, email, telefone, cpf } = req.body;

    try {
        const query = `insert into usuarios (nome, idade, email, telefone, cpf) 
        values ($1, $2, $3, $4, $5)`;
        const valores = [nome,idade,email, telefone,cpf]

        const usuarioCadastrado = await conexao.query(query, valores);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastar o usuario');
        }


        return res.status(200).json('Usuario cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const atualizarUsuario = async (req,res) =>{
    const { id } = req.params;
    const { nome, idade, email, telefone, cpf } = req.body;

    try {
        const usuario = await conexao.query('select * from usuarios where id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json('Usuario não encontrado.');
        }

        const query = `update usuarios set 
        nome = $1,
        idade = $2,
        email = $3,
        telefone = $4,
        cpf = $5
        where id = $6`;

        const usuarioAtualizado = await conexao.query(query, [nome, idade, email, telefone, cpf, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o usuario');
        }

        return res.status(200).json('O usuario foi atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirUsuario = async (req,res) =>{

    const { id } = req.params;

    try {
        const usuario = await conexao.query('select * from usuarios where id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json('Usuario não encontrado.');
        }

        const query = 'delete from usuarios where id = $1';
        const UsuarioExcluido = await conexao.query(query, [id]);

        if (UsuarioExcluido.rowCount === 0) {
            return res.status(400).json('Não foi possível excluir o usuario')
        }

        return res.status(200).json('O Usuario foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    listarUsuarios, 
    filtrarUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
}