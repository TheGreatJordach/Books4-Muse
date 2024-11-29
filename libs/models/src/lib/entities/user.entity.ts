import { IUser } from '../business-types/users.interface';
import { AuthScope } from '../business-types/auth.scrop.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity("Users")
export class EUser implements IUser{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({default: true})
  isActive!: boolean;

  @IsEmail()
  @Column({unique:true, nullable:false})
  email!: string;

  @Column({nullable:false})
  firstName!: string;

  @Column({nullable:false})
  lastName!: string;

  @Column({nullable:false})

  @Column({nullable:false})
  password!: string;

  @Column({type:"enum", enum: AuthScope,default: AuthScope.AMBASSADOR})
  authScope!: AuthScope;

  @VersionColumn()
  version!: number;

  // Utility Methods
  toggleUserStatus() {
    this.isActive = !this.isActive;
  }

  setAuthScope(authScope: AuthScope) {
    this.authScope = authScope;
  }

  getAuthScope(): AuthScope {
    return this.authScope;
  }

  @CreateDateColumn()
  createAt!:Date
  @UpdateDateColumn()
  updateAt!:Date
}
