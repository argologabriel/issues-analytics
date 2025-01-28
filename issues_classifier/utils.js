function filtrarTemaRelacionado(resTemaRelacionado) {
	if (resTemaRelacionado.includes("1")) {
		return "Arquitetura de Software";
	}
	if (resTemaRelacionado.includes("2")) {
			return "Padrões e Estilos Arquiteturais";
	}
	if (resTemaRelacionado.includes("3")) {
			return "Padrões de Projeto";
	}
	return "Nenhuma das opções";
}

module.exports = { filtrarTemaRelacionado };
