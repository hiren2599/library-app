export const Pagination: React.FC<{
	currentPage: number;
	totalPages: number;
	paginate: any;
}> = (props) => {
	const pageNumbers = [];

	if (props.currentPage === 1) {
		pageNumbers.push(props.currentPage);
		if (props.currentPage + 1 <= props.totalPages) {
			pageNumbers.push(props.currentPage + 1);
		}
		if (props.currentPage + 2 <= props.totalPages) {
			pageNumbers.push(props.currentPage + 2);
		}
	} else if (props.currentPage > 1) {
		if (props.currentPage - 2 > 0) {
			pageNumbers.push(props.currentPage - 2);
		}
		if (props.currentPage - 1 > 0) {
			pageNumbers.push(props.currentPage - 1);
		}
		pageNumbers.push(props.currentPage);
		if (props.currentPage + 1 <= props.totalPages) {
			pageNumbers.push(props.currentPage + 1);
		}
		if (props.currentPage + 2 <= props.totalPages) {
			pageNumbers.push(props.currentPage + 2);
		}
	}

	return (
		<nav aria-label="...">
			<ul className="pagination">
				<li className="page-item" onClick={() => props.paginate(1)}>
					<button className="page-link">First Page</button>
				</li>
				{pageNumbers.map((pageNumber) => (
					<li
						className={
							"page-item" + (pageNumber === props.currentPage ? " active" : "")
						}
						onClick={() => props.paginate(pageNumber)}
					>
						<button className="page-link">{pageNumber}</button>
					</li>
				))}
				<li
					className="page-item"
					onClick={() => props.paginate(props.totalPages)}
				>
					<button className="page-link">Last Page</button>
				</li>
			</ul>
		</nav>
	);
};
