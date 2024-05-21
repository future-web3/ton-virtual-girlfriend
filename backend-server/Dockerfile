FROM python:3.9

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到容器的/app目录
COPY . /app

# 安装Python依赖
RUN pip install -r requirements.txt

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    ca-certificates \
    libasound2 \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 安装OpenSSL 1.x从源代码
RUN wget -O - https://www.openssl.org/source/openssl-1.1.1u.tar.gz | tar zxf - \
    && cd openssl-1.1.1u \
    && ./config --prefix=/usr/local \
    && make -j$(nproc) \
    && make install_sw install_ssldirs \
    && ldconfig -v

# 运行Prisma生成命令
RUN prisma generate

# 设置环境变量
ENV SSL_CERT_DIR=/etc/ssl/certs
ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

EXPOSE 8080

CMD ["python", "./server.py"]
