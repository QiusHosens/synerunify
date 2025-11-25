# async_port_scanner.py
import asyncio
import socket
from datetime import datetime

async def probe_port(host: str, port: int, timeout: float = 1.0) -> tuple[int, bool]:
    """异步探测单个端口"""
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout
        )
        writer.close()
        await writer.wait_closed()
        return port, True
    except (asyncio.TimeoutError, OSError, ConnectionRefusedError):
        return port, False

async def async_scan(target: str,
                     ports,
                     *,
                     timeout: float = 0.8,
                     max_concurrency: int = 5000) -> list[int]:
    """
    超高速异步端口扫描
    参数:
        target: 目标 IP 或域名
        ports: 要扫描的端口列表或 range
        timeout: 单端口超时（秒），建议 0.5~1.0
        max_concurrency: 最大并发连接数（越大越快，但会被防火墙限流）
    """
    semaphore = asyncio.Semaphore(max_concurrency)

    async def sem_task(port):
        async with semaphore:
            return await probe_port(target, port, timeout)

    print(f"协程扫描启动 → {target}")
    print(f"端口数量: {len(ports)}  最大并发: {max_concurrency}  超时: {timeout}s")
    print(f"开始时间: {datetime.now():%Y-%m-%d %H:%M:%S}\n")

    open_ports = []
    tasks = [sem_task(port) for port in ports]

    for coro in asyncio.as_completed(tasks):
        port, is_open = await coro
        if is_open:
            print(f"[+] {port:5d} 开放")
            open_ports.append(port)

    print(f"\n扫描完成！开放端口: {len(open_ports)} 个")
    print(f"结束时间: {datetime.now():%Y-%m-%d %H:%M:%S}")
    return sorted(open_ports)

# ==================== 使用示例 ====================
if __name__ == "__main__":
    # target = "scanme.nmap.org"      # 官方允许扫描
    # target = "1.1.1.1"
    target = "192.168.1.30"

    # 方案1：全端口扫描（65535），3~8秒完成
    ports = range(1, 65536)

    # 方案2：超快常见端口扫描（<0.5秒）
    # ports = [21,22,23,25,53,80,110,135,139,443,445,993,995,1723,3306,3389,5432,5900,6379,8080,9200]

    start = datetime.now()
    open_ports = asyncio.run(
        async_scan(
            target,
            ports,
            timeout=3,          # 调低更快，但漏报率略增
            max_concurrency=8000  # 越大越快，建议 5000~15000
        )
    )
    print(f"总耗时: {datetime.now() - start}")
    print("开放端口列表:", open_ports)